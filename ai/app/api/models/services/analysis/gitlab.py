from api.models.dto import GitLabAnalysisRequest
from api.models.services.analysis import AnalysisService


class GitLabAnalysisService(AnalysisService[GitLabAnalysisRequest]):
    pass
