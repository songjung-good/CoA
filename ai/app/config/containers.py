from dependency_injector import providers
from dependency_injector.containers import DeclarativeContainer
from dotenv import load_dotenv
from redis import Redis

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest
from api.models.services.analysis.mock import MockAnalysisService


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

    github_analysis_service = providers.Singleton(MockAnalysisService[GithubAnalysisRequest], redis_client)  # Mock
    gitlab_analysis_service = providers.Singleton(MockAnalysisService[GitLabAnalysisRequest], redis_client)  # Mock

