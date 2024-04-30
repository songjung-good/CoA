from fastapi import APIRouter

from app.db.redis_config import redis_client

router = APIRouter(prefix="")


@router.get("/")
def get():
    return "Hello, World!"


@router.get('/test')
def get_test():
    redis_client.set('python_test', 'test')
    return 'test'
