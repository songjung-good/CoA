from redis import Redis
import os

redis_client = Redis(
    host=os.getenv('REDIS_HOST'),
    port=os.getenv('REDIS_PORT')
)
