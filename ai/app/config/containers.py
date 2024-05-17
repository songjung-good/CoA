import os
from typing import TypeVar

from dependency_injector import providers
from dependency_injector.containers import DeclarativeContainer
from dotenv import load_dotenv
from langchain_openai import OpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathspec import PathSpec
from pathspec.patterns import GitWildMatchPattern
from redis import Redis

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest, AnalysisRequest
from api.models.services.ai import AiService
from api.models.services.ai.chains import AiChains
from api.models.services.ai.mutex import AiMutex
from api.models.services.analysis import AnalysisService
from api.models.services.client import RepoClient
from api.models.services.client.github_rest import GithubRestClient
from api.models.services.client.gitlab import GitLabClient


def load_analysisignore() -> PathSpec:
    with open('resources/.analysisignore', 'r') as f:
        return PathSpec.from_lines(GitWildMatchPattern, f)


R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class Container(DeclarativeContainer):
    config = providers.Configuration()

    load_dotenv(os.getenv('ENV_FILE_PATH'))
    config.redis.host.from_env('REDIS_HOST', as_=str, required=True)
    config.redis.port.from_env('REDIS_PORT', as_=int, required=True)

    # config.ai.model_path.from_env('MODEL_PATH', as_=str, required=True)
    config.ai.openai_api_key.from_env('OPENAI_API_KEY', as_=str, required=True)

    redis_client = providers.Resource(
        provides=Redis,
        host=config.redis.host,
        port=config.redis.port
    )

    ignore_spec = providers.Resource(load_analysisignore)

    repo_client: dict[R, providers.Factory[RepoClient[R]]] = {
        GithubAnalysisRequest: providers.Factory(GithubRestClient, ignore_spec=ignore_spec),
        GitLabAnalysisRequest: providers.Factory(GitLabClient, ignore_spec=ignore_spec)
    }

    llm = providers.Resource(
        provides=OpenAI,
        openai_api_key=config.ai.openai_api_key,
        temperature=0.3,
        verbose=True,
        max_tokens=1000
    )
    text_splitter = providers.Singleton(
        provides=RecursiveCharacterTextSplitter,
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False
    )

    ai_chains = providers.Singleton(AiChains, llm)

    ai_mutex = providers.Singleton(AiMutex, ai_chains)
    ai_service = providers.Singleton(AiService, text_splitter)

    analysis_service = providers.Singleton(AnalysisService, redis_client, ai_mutex, ai_service)

