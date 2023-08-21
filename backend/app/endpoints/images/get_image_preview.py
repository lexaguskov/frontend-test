from app.config import config
import os
from PIL import Image

from fastapi import APIRouter, status
from fastapi.responses import FileResponse

router = APIRouter()


def resize_image(input_path, output_path, new_size):
    img = Image.open(input_path)
    w = img.width
    h = img.height
    level = 0
    while w > 320 and h > 480:
        level += 1
        w /= 2
        h /= 2

        copy = img.copy()
        copy.thumbnail((w, h))
        copy.save(output_path + "@" + str(level) + ".jpg", "JPEG")

    img.thumbnail(new_size)
    img.save(output_path + '.thumb.jpg', "JPEG")

# NOTE: this functions generates previews on the fly
# perhaps we should consider generating them during the data preparation phase


@router.get(
    "/images/{file_stem}/preview",
    status_code=status.HTTP_200_OK,
)
async def get_image_preview(file_stem: str):
    if not file_stem.isalnum():
        return status.HTTP_404_NOT_FOUND

    preview_path = f"{config.previews_dir}/{file_stem}.thumb.jpg"
    pp = f"{config.previews_dir}/{file_stem}"
    file_path = f"{config.images_dir}/{file_stem}.jpg"

    if os.path.exists(preview_path) and os.path.isfile(preview_path):
        return FileResponse(preview_path)

    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        return status.HTTP_404_NOT_FOUND

    new_size = (150, 100)
    resize_image(file_path, pp, new_size)
    # FIXME: preview file could be corrupted if an exception happens during conversion

    return FileResponse(preview_path)


@router.get(
    "/images/{file_stem}/{level}",
    status_code=status.HTTP_200_OK,
)
async def get_image_mipmap(file_stem: str, level: str):
    if not file_stem.isalnum():
        return status.HTTP_404_NOT_FOUND

    if not level.isnumeric():
        return status.HTTP_404_NOT_FOUND

    if int(level) < 1 or int(level) > 4:
        return status.HTTP_404_NOT_FOUND

    preview_path = f"{config.previews_dir}/{file_stem}@{level}.jpg"
    pp = f"{config.previews_dir}/{file_stem}"
    file_path = f"{config.images_dir}/{file_stem}.jpg"

    if os.path.exists(preview_path) and os.path.isfile(preview_path):
        return FileResponse(preview_path)

    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        return status.HTTP_404_NOT_FOUND

    new_size = (150, 100)
    resize_image(file_path, pp, new_size)
    # FIXME: preview file could be corrupted if an exception happens during conversion

    return FileResponse(preview_path)
