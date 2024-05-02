from dependency_injector.containers import DeclarativeContainer
from dependency_injector import providers

from dotenv import load_dotenv
from redis import Redis


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

