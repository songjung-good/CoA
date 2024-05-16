import os
import sys

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI

from api.routers import index, analysis
from config.containers import Container

app = FastAPI()

load_dotenv(os.getenv('ENV_FILE_PATH'))

app.include_router(index.router)
app.include_router(analysis.router)

if __name__ == '__main__':
    container = Container()
    container.wire([sys.modules[__name__]])
    container.init_resources()

    uvicorn.run(
        'main:app',
        host=os.getenv('HOST'),
        port=int(os.getenv('PORT')),
        env_file=os.getenv('ENV_FILE_PATH'),
        workers=int(os.getenv('WORKERS_CNT'))
    )
