from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Text, insert, select
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import SQLBase, async_session


class Comment(SQLBase):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created_at: Mapped[DateTime] = mapped_column(DateTime(), default=datetime.utcnow)
    text: Mapped[str] = mapped_column(Text(), primary_key=True)

    @staticmethod
    async def insert(text):
        async with async_session() as session:
            await session.execute(
                insert(Comment).values(
                    text=text,
                )
            )
            await session.commit()

    @staticmethod
    async def list():
        async with async_session() as session:
            return [
                comment
                for comment in (
                    await session.execute(
                        select(Comment).order_by(Comment.created_at.desc())
                    )
                ).scalars()
            ]
