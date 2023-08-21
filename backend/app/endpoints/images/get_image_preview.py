from app.config import config
import os
from PIL import Image

from fastapi import APIRouter, status
from fastapi.responses import FileResponse

router = APIRouter()


def resize_image(input_path, output_path, new_size):
    img = Image.open(input_path)
    img.thumbnail(new_size)
    img.save(output_path, "JPEG")

# NOTE: this functions generates previews on the fly
# perhaps we should consider generating them during the data preparation phase


@router.get(
    "/images/{file_stem}/preview",
    status_code=status.HTTP_200_OK,
)
async def get_image_preview(file_stem: str):
    print(file_stem, flush=True)
    if not file_stem.isalnum():
        return status.HTTP_404_NOT_FOUND

    preview_path = f"{config.previews_dir}/{file_stem}.jpg"
    file_path = f"{config.images_dir}/{file_stem}.jpg"

    print(preview_path, file_path, flush=True)

    if os.path.exists(preview_path) and os.path.isfile(preview_path):
        return FileResponse(preview_path)

    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        return status.HTTP_404_NOT_FOUND

    new_size = (150, 100)
    resize_image(file_path, preview_path, new_size)
    # FIXME: preview file could be corrupted if an exception happens during conversion

    return FileResponse(preview_path)
