from fastapi import APIRouter, Depends, BackgroundTasks

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest
from api.models.services.analysis import AnalysisService
from config.containers import Container

router = APIRouter(prefix='/analysis')


@router.post('/github')
def post_github(
        request: GithubAnalysisRequest,
        background_tasks: BackgroundTasks,
        analysis_service: AnalysisService = Depends(lambda: Container.analysis_service()),
) -> bool:
    background_tasks.add_task(analysis_service.analyze, request)
    return True


@router.post('/gitlab')
def post_gitlab(
        request: GitLabAnalysisRequest,
        background_tasks: BackgroundTasks,
        analysis_service: AnalysisService = Depends(lambda: Container.analysis_service())
) -> bool:
    background_tasks.add_task(analysis_service.analyze, request)
    return True
