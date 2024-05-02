from api.models.services import AnalysisService
from api.routers.analysis import GithubAnalysisRequest


class GithubAnalysisService(AnalysisService[GithubAnalysisRequest]):
    pass
