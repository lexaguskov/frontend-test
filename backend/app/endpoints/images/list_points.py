from app.config import config
from pathlib import Path

from fastapi import APIRouter, status
from pydantic import BaseModel

from app.database.comment import Comment

router = APIRouter()


@router.get(
    "/images/{image}/points",
    status_code=status.HTTP_200_OK,
)
async def list_points(image):
    res = await Comment.list(image)
    # TODO: use Image class
    return res
