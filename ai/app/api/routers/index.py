from uuid import UUID

from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends
from redis import Redis

from config.containers import Container
from util import save_analysis_data

router = APIRouter(prefix="")


@router.get("/")
def get():
    return "Hello, World!"


@router.get('/redis-test')
@inject
def get_test(
        redis_client: Redis = Depends(lambda: Container.redis_client())
):
    save_analysis_data(
        redis_client,
        uuid=UUID(int=0x12345678123456781234567812345678),
        data={
            'hi': {
                'hello': 123
            }
        }
    )
    return 'test'
