from abc import ABCMeta

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.models.services import AnalysisService
from config.containers import Container

router = APIRouter(prefix='/analysis')


class AnalysisRequest(BaseModel, metaclass=ABCMeta):
    """분석 요청에 대한 body DTO 추상 클래스"""
    analysisId: str
    userName: str


class GithubAnalysisRequest(AnalysisRequest):
    """Github 분석 요청에 대한 body DTO"""
    repoPath: str
    accessToken: str


class GitLabAnalysisRequest(AnalysisRequest):
    """GitLab 분석 요청에 대한 body DTO"""
    baseUrl: str
    projectId: str
    privateToken: str


@router.post('/github')
def post_github(
        request: GithubAnalysisRequest,
        analysis_service: AnalysisService = Depends(lambda: Container.github_analysis_service())
):
    return request


@router.post('/gitlab')
def post_gitlab(
        request: GitLabAnalysisRequest,
        analysis_service: AnalysisService = Depends(lambda: Container.gitlab_analysis_service())
):
    return request
