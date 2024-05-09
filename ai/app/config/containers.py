import os
from typing import TypeVar, Type

from dependency_injector import providers
from dependency_injector.containers import DeclarativeContainer
from dotenv import load_dotenv
from redis import Redis

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest, AnalysisRequest
from api.models.services.analysis import AnalysisService
from api.models.services.client import RepoClient
from api.models.services.client.github_rest import GithubRestClient
from api.models.services.client.gitlab import GitLabClient

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class Container(DeclarativeContainer):
    config = providers.Configuration()

    load_dotenv(os.getenv('ENV_FILE_PATH'))
    config.redis.host.from_env('REDIS_HOST', as_=str, default='')
    config.redis.port.from_env('REDIS_PORT', as_=int, default=0)

    redis_client = providers.Resource(
        provides=Redis,
        host=config.redis.host,
        port=config.redis.port
    )

    analysis_service = providers.Singleton(AnalysisService, redis_client)  # Mock

    repo_client: dict[R, providers.Factory[RepoClient[R]]] = {
        GithubAnalysisRequest: providers.Factory(GithubRestClient),
        GitLabAnalysisRequest: providers.Factory(GitLabClient)
    }

