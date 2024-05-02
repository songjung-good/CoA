from abc import ABCMeta

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix='/analysis')


class AnalysisRequest(BaseModel, metaclass=ABCMeta):
    analysisId: int
    userName: str

    class Github('AnalysisRequest'):
        repoPath: str
        accessToken: str

    class GitLab('AnalysisRequest'):
        baseUrl: str
        projectId: str
        privateToken: str


@router.post('/github')
def post_github(request: AnalysisRequest.Github):
    return request


@router.post('/gitlab')
def post_gitlab(request: AnalysisRequest.GitLab):
    return request
