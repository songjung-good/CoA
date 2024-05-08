from typing import Any

from api.models.services.client import RepoClient


class GithubGraphQLClient(RepoClient):
    def __init__(self, path: str, access_token: str | None = None):
        """
        Github GraphQL API 클라이언트를 만듭니다.

        Parameters:
            path: Github 저장소 경로 (예: DoubleDeltas/MineCollector)
        """
        self.path = path
        self.access_token = access_token

    async def load(self, author_name: str) -> dict[Any, Any]:
        # TODO
        pass
