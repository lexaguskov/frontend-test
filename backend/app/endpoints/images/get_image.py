import os

from fastapi import APIRouter, status
from fastapi.responses import FileResponse

router = APIRouter()

from app.config import config

@router.get(
    "/images/{file_stem}",
    status_code=status.HTTP_200_OK,
)
async def get_image(file_stem: str):
    if not file_stem.isalnum():
        return status.HTTP_404_NOT_FOUND
    
    file_path = f"{config.images_dir}/{file_stem}.jpg"  

    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    else:
        return status.HTTP_404_NOT_FOUND
