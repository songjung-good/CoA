from dependency_injector.containers import DeclarativeContainer
from dependency_injector import providers

from redis import Redis


class Container(DeclarativeContainer):
    config = providers.Configuration()

    redis_client = providers.Resource(
        provides=Redis,
        host=config.redis.host,
        port=config.redis.port
    )

