from abc import ABCMeta
from typing import TypeVar, Generic

from dependency_injector.wiring import inject
from fastapi import BackgroundTasks
from redis import Redis

from api.models.dto import AnalysisRequest, GithubAnalysisRequest, GitLabAnalysisRequest

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService(Generic[R], metaclass=ABCMeta):
    # abstract class AnalysisService<R extends AnalysisRequest> { ... }

    def __init__(self, redis_client: Redis):
        self.redis_client = redis_client

    async def analyze(self, request: R) -> None:
        # TODO: 각 단계를 나누어 추상 메소드를 호출하고 처리 상태 변경
        return


class MockAnalysisService(AnalysisService[GithubAnalysisRequest], AnalysisService[GitLabAnalysisRequest]):
    """가짜 분석 서비스"""

