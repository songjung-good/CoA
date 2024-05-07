from api.models.dto import GithubAnalysisRequest
from api.models.services.analysis import AnalysisService


class GithubAnalysisService(AnalysisService[GithubAnalysisRequest]):
    pass
