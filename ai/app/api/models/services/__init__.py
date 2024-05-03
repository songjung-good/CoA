import asyncio
from abc import ABCMeta, abstractmethod
from typing import TypeVar, Generic, Any

from redis import Redis

from api.models.dto import AnalysisRequest, GithubAnalysisRequest, GitLabAnalysisRequest
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService(Generic[R], metaclass=ABCMeta):
    # abstract class AnalysisService<R extends AnalysisRequest> { ... }
    """분석 서비스의 기본 클래스"""

    def __init__(self, redis_client: Redis):
        self.redis_client = redis_client

    async def analyze(self, request: R) -> None:
        # TODO: 각 단계를 나누어 추상 메소드를 호출하고 처리 상태 변경
        try:
            # 레포 요청 가능 여부 확인하기

            # 레포에서 내용 가져오기

            # 레포에서 데이터 가져오기
            commits = await self.load_commits(request)

            # AI에 학습 시키기

            # 대화해서 학습 결과 긁어오기

            # 학습 취소시키기

            # 완료 처리

        except AnalysisException:
            # TODO: redis에 percentage 0으로 만들고 statusCode 바꾸기
            pass

    @abstractmethod
    async def is_content_loadable(self) -> bool:
        pass

    @abstractmethod
    async def is_commits_loadable(self) -> bool:
        pass

    @abstractmethod
    async def load_commits(self, request: R) -> list[dict[Any, Any]]:
        pass


class MockAnalysisService(Generic[R], AnalysisService[R]):
    """가짜 분석 서비스
    데이터 요청(5초) - 학습(5초) - 답변 생성(10초)의 딜레이로 고정된 데이터를 보내줍니다.
    """

    async def is_content_loadable(self) -> bool:
        return True

    async def is_commits_loadable(self) -> bool:
        return True

    async def load_commits(self, request: R) -> list[dict[Any, Any]]:
        await asyncio.sleep(5)
        return [
            {
                'id': '5c47a3c8c3892f5277680a3f0cb934a9843ab1a3',
                'patches': ['@@ -0,0 +1 @@\n+Hello, ssafy!']
            },
            {
                'id': '71541e9e6d7850a27476063d10313f5f6d1d9baf',
                'patches': ['@@ -0,0 +1,2 @@\n+# CoATest\n+test repo']
            }
        ]
