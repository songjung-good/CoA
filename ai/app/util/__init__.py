import json
from uuid import UUID

from dependency_injector.wiring import inject
from redis import Redis


@inject
def save_analysis_data(redis_client: Redis, uuid: UUID, data: dict):
    redis_client.hset('analysis_data', str(uuid), json.dumps(data))
