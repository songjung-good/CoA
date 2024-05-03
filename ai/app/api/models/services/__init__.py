from abc import ABCMeta
from typing import TypeVar, Generic

from dependency_injector.wiring import inject
from fastapi import BackgroundTasks
from redis import Redis

from api.models.dto import AnalysisRequest

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService(Generic[R], metaclass=ABCMeta):   # class AnalysisService<R extends AnalysisRequest> { ... }
    def __init__(self, redis_client: Redis):
        self.redis_client = redis_client

    def start_analysis(self, background_tasks: BackgroundTasks, request: R) -> bool:
        background_tasks.add_task(self.analyze, request)
        return True

    async def analyze(self, request: R) -> None:
        # TODO: 각 단계를 나누어 추상 메소드를 호출하고 처리 상태 변경
        return
