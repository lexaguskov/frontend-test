from uuid import UUID

from fastapi import APIRouter, status

router = APIRouter()


@router.get(
    "/images/{file_stem}",
    status_code=status.HTTP_200_OK,
)
async def get_image(file_stem: str):
    pass
