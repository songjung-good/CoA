from dependency_injector.wiring import inject
from fastapi import APIRouter, Depends
from redis import Redis

from config.containers import Container

router = APIRouter(prefix="")


@router.get("/")
def get():
    return "Hello, World!"


@router.get('/redis-test')
@inject
def get_test(
        redis_client: Redis = Depends(lambda: Container.redis_client())
):
    redis_client.set('python_test', 'test')
    return 'test'
