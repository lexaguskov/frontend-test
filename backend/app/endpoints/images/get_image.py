import os

from fastapi import APIRouter, status, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()

from app.config import config

@router.get(
    "/images/{file_stem}",
    status_code=status.HTTP_200_OK,
)
async def get_image(file_stem: str):
    print(file_stem, flush=True)
    if not file_stem.isalnum():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File stem must be alphanumeric")
    
    file_path = f"{config.images_dir}/{file_stem}.jpg"  

    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    else:
        return status.HTTP_404_NOT_FOUND
