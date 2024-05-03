from api.models.dto import GithubAnalysisRequest
from api.models.services import AnalysisService


class GithubAnalysisService(AnalysisService[GithubAnalysisRequest]):
    async def analyze(self, request: GithubAnalysisRequest) -> None:
        pass    # todo
