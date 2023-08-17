from itertools import product
import io
from pathlib import Path

import zipfile

import requests

import PIL
import PIL.Image

PIL.Image.MAX_IMAGE_PIXELS = 16 * 1024 ** 3


def dim_spans(M, div):
    borders = list(range(0, M+1, M//div))
    return zip(borders, map(lambda x: x-1, borders[1:]))

def spans(M, N, div):
    return product(dim_spans(M, div), dim_spans(N, div))


zip_file = io.BytesIO(requests.get("https://www.lantmateriet.se/geodata/demodata_testdata/GEO-demo/Bilddata/Digitala_flygbilder/4kanal/2017_images_rgb_PatB.zip", stream=True).content)

#zip_file = "/home/jim/Downloads/drone/2017_images_rgb_PatB.zip"

data_path = Path("data")

data_path.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(zip_file) as data_zip:
    for data_zip_info in data_zip.infolist():
        
        file_path = Path(data_zip_info.filename)
        file_extension = file_path.suffix.lstrip(".")

        if file_extension == "tif":
            print(file_path)
            with data_zip.open(data_zip_info) as f:
                image = PIL.Image.open(f)
                print(image)
                M, N = image.size
                for span in spans(M, N, 4):
                    ((left, right), (upper, lower)) = span
                    crop_file_path = f"{data_path}/{file_path.stem}.{left}-{right},{upper}-{lower}.tif"
                    print(crop_file_path)
                    image.crop((left, upper, right, lower)).save(crop_file_path)

