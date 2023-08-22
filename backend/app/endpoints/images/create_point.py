from app.config import config
from pathlib import Path

from fastapi import APIRouter, status
from pydantic import BaseModel

from app.database.comment import Comment

router = APIRouter()


class PointCreate(BaseModel):
    x: int
    y: int
    text: str


@router.post(
    "/images/{image}/points",
    status_code=status.HTTP_200_OK,
)
async def create_point(image, point: PointCreate):
    # TODO: validate image
    res = await Comment.insert(image, point.x, point.y, point.text)
    return res
