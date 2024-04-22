from fastapi import FastAPI
import uvicorn

from api.routers import index

app = FastAPI()

app.include_router(index.router)

if __name__ == '__main__':
    uvicorn.run(app)