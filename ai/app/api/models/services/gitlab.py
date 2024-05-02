from api.models.services import AnalysisService
from api.routers.analysis import GitLabAnalysisRequest


class GitLabAnalysisService(AnalysisService[GitLabAnalysisRequest]):
    pass
