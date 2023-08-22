from fastapi import APIRouter, status

from app.database.comment import Comment

router = APIRouter()


@router.delete(
    "/images/{image}/points/{id}",
    status_code=status.HTTP_200_OK,
)
async def delete_point(image: str, id: str):
    res = await Comment.delete(image, id)
    return res
