from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter()


class Health(BaseModel):
    status: str


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    response_model=Health,
)
def health():
    return Health(status="ok")
