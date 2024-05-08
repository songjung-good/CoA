from typing import Any

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisRequest, GithubAnalysisRequest

from api.models.services.client import RepoClient


class GithubGraphQLClient(RepoClient[GithubAnalysisRequest]):
    """
    Github GraphQL API에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    """

    def __init__(self, request: GithubAnalysisRequest):
        """
        Github GraphQL API 클라이언트를 만듭니다.

        Parameters:
            path: Github 저장소 경로 (예: DoubleDeltas/MineCollector)
        """
        # TODO

    async def check_loadability(self, request: AnalysisRequest) -> AnalysisStatus | None:
        pass

    async def load(self, author_name: str) -> dict[Any, Any]:
        # TODO
        pass
