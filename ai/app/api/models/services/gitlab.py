from api.models.dto import GitLabAnalysisRequest
from api.models.services import AnalysisService


class GitLabAnalysisService(AnalysisService[GitLabAnalysisRequest]):
    async def analyze(self, request: GitLabAnalysisRequest) -> None:
        pass    # todo
