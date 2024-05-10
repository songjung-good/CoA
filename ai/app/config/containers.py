import os
from typing import TypeVar

from dependency_injector import providers
from dependency_injector.containers import DeclarativeContainer
from dotenv import load_dotenv
from langchain_community.llms.llamacpp import LlamaCpp
from langchain_core.language_models import BaseLLM, BaseChatModel
from langchain_experimental.chat_models import Llama2Chat
from redis import Redis

from api.models.dto import GithubAnalysisRequest, GitLabAnalysisRequest, AnalysisRequest
from api.models.services.ai import AiService
from api.models.services.ai.mutex import AiMutex
from api.models.services.analysis import AnalysisService
from api.models.services.client import RepoClient
from api.models.services.client.github_rest import GithubRestClient
from api.models.services.client.gitlab import GitLabClient

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class Container(DeclarativeContainer):
    config = providers.Configuration()

    load_dotenv(os.getenv('ENV_FILE_PATH'))
    config.redis.host.from_env('REDIS_HOST', as_=str, required=True)
    config.redis.port.from_env('REDIS_PORT', as_=int, required=True)

    config.ai.model_path.from_env('MODEL_PATH', as_=str, required=True)

    redis_client = providers.Resource(
        provides=Redis,
        host=config.redis.host,
        port=config.redis.port
    )

    repo_client: dict[R, providers.Factory[RepoClient[R]]] = {
        GithubAnalysisRequest: providers.Factory(GithubRestClient),
        GitLabAnalysisRequest: providers.Factory(GitLabClient)
    }

    llm = providers.Resource(
        provides=LlamaCpp,
        model_path=config.ai.model_path,
        n_gpu_layers=-1,
        temperature=0.3,
        f16_kv=True,
        verbose=False
    )
    chat_model = providers.Resource(
        provides=Llama2Chat,
        llm=llm,
        temparature=0.3
    )

    ai_mutex = providers.Singleton(AiMutex, chat_model)
    ai_service = providers.Singleton(AiService, chat_model, ai_mutex)

    analysis_service = providers.Singleton(AnalysisService, redis_client, ai_mutex, ai_service)