from dependency_injector import providers
from dependency_injector.containers import DeclarativeContainer
from dotenv import load_dotenv
from redis import Redis

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest
from api.models.services.analysis.mock import MockAnalysisService
from api.models.services.client import RepoClient
from api.models.services.client.github_rest import GithubRestClient
from api.models.services.client.gitlab import GitLabClient


class Container(DeclarativeContainer):
    config = providers.Configuration()

    load_dotenv()
    config.redis.host.from_env('REDIS_HOST', as_=str, default='')
    config.redis.port.from_env('REDIS_PORT', as_=int, default=0)

    redis_client = providers.Resource(
        provides=Redis,
        host=config.redis.host,
        port=config.redis.port
    )

    analysis_service = providers.Singleton(MockAnalysisService, redis_client)  # Mock

    github_client: providers.Factory[RepoClient[GithubAnalysisRequest]] = providers.Factory(GithubRestClient)
    gitlab_client: providers.Factory[RepoClient[GitLabAnalysisRequest]] = providers.Factory(GitLabClient)

