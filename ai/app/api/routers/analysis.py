from fastapi import APIRouter, Depends

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest
from api.models.services import AnalysisService
from config.containers import Container

router = APIRouter(prefix='/analysis')


@router.post('/github')
def post_github(
        request: GithubAnalysisRequest,
        analysis_service: AnalysisService[GithubAnalysisRequest] = Depends(lambda: Container.github_analysis_service())
):
    return request


@router.post('/gitlab')
def post_gitlab(
        request: GitLabAnalysisRequest,
        analysis_service: AnalysisService[GitLabAnalysisRequest] = Depends(lambda: Container.gitlab_analysis_service())
):
    return request
