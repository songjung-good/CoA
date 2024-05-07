import sys
import os

from fastapi import FastAPI
import uvicorn

from dotenv import load_dotenv

from api.routers import index, analysis
from config.containers import Container

app = FastAPI()

load_dotenv()

app.include_router(index.router)
app.include_router(analysis.router)

if __name__ == '__main__':
    container = Container()
    container.wire([sys.modules[__name__]])

    uvicorn.run(app, port=int(os.getenv('PORT')))
