from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Text, Integer, insert, select
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import SQLBase, async_session


class Comment(SQLBase):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(), default=datetime.utcnow)
    text: Mapped[str] = mapped_column(Text())
    x: Mapped[int] = mapped_column(Integer(), default=0)
    y: Mapped[int] = mapped_column(Integer(), default=0)
    image: Mapped[str] = mapped_column(Text(), primary_key=True)

    @staticmethod
    async def insert(image, x, y, text):
        async with async_session() as session:
            result = await session.execute(
                insert(Comment).values(
                    text=text,
                    x=x,
                    y=y,
                    image=image
                )
            )
            await session.commit()
            return result.inserted_primary_key[0]

    @staticmethod
    async def list(image):
        async with async_session() as session:
            return [
                comment
                for comment in (
                    await session.execute(
                        select(Comment)
                        .filter(Comment.image == image)
                        .order_by(Comment.created_at.desc())
                    )
                ).scalars()
            ]

    @staticmethod
    async def delete(image: str, id: UUID):
        async with async_session() as session:
            comment = (
                await session.execute(
                    select(Comment)
                    .filter(Comment.id == id, Comment.image == image)
                )
            ).scalar_one_or_none()

            if comment:
                session.delete(comment)
                await session.commit()
                return True
            else:
                return False
