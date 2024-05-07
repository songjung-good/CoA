import asyncio
from typing import Generic, TypeVar, Any

from api.models.dto import AnalysisRequest
from api.models.services.analysis import AnalysisService

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class MockAnalysisService(Generic[R], AnalysisService[R]):
    """가짜 분석 서비스
    일정한 딜레이로 고정된 데이터를 보내줍니다.
    """

    async def assert_content_loadable(self) -> None:
        pass

    async def assert_commits_loadable(self) -> bool:
        pass

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

    async def load_content(self, request: R) -> list[dict[Any, Any]]:
        pass