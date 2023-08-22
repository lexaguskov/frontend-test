import argparse
import asyncio

import uvicorn
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from app.endpoints import health
from app.endpoints.images import get_image, list_images, get_image_preview, list_points, create_point, delete_point

from .database.comment import Comment
from .database.database import engine

api = FastAPI(
    title="frontend-challenge-backend",
)

# CORS errors instead of seeing internal exceptions
# https://stackoverflow.com/questions/63606055/why-do-i-get-cors-error-reason-cors-request-did-not-succeed
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Comment.metadata.create_all)


@api.on_event("startup")
async def startup_event():
    asyncio.create_task(init_models())


@api.get("/", status_code=status.HTTP_303_SEE_OTHER, include_in_schema=False)
def redirect_to_docs():
    return RedirectResponse(url="/docs")


api.include_router(health.router)
api.include_router(list_images.router)
api.include_router(get_image.router)
api.include_router(list_points.router)
api.include_router(get_image_preview.router)
api.include_router(create_point.router)
api.include_router(delete_point.router)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="0.0.0.0")
    parser.add_argument("--port", type=int, default=80)
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--reload", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    uvicorn.run(
        "app.main:api",
        host=args.host,
        port=args.port,
        reload=args.reload,
        workers=1 if args.reload else args.workers,
        log_level="debug" if args.verbose else "info",
        reload_dirs=["app"],
    )
