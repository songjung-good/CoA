import sys
import os

from fastapi import FastAPI
import uvicorn

from dotenv import load_dotenv

from api.routers import index
from config.containers import Container

app = FastAPI()

load_dotenv()

app.include_router(index.router)

if __name__ == '__main__':
    container = Container()
    container.wire([sys.modules[__name__]])

    container.config.redis.host.from_env('REDIS_HOST', as_=str, default='')
    container.config.redis.port.from_env('REDIS_PORT', as_=int, default=0)

    print(container.config.redis())

    uvicorn.run(app, port=int(os.getenv('PORT')))