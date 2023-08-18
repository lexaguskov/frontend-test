import logging
from dataclasses import asdict

from pydantic import dataclasses
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import config


class SQLBase(DeclarativeBase):
    def dict(self):
        return {
            key: (
                getattr(self, key).dict()
                if hasattr(getattr(self, key), "dict")
                else getattr(self, key)
            )
            for key in self.__mapper__.attrs.keys()
        }

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.dict()})"


@dataclasses.dataclass
class SQLNestedBase:
    def dict(self):
        return asdict(self)


engine = create_async_engine(
    config.postgres_url,
    echo=False,
    pool_pre_ping=True,
    connect_args={
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    },
)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
