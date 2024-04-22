from fastapi import FastAPI
import uvicorn
from dotenv import load_dotenv

from api.routers import index

load_dotenv()

app = FastAPI()

app.include_router(index.router)

if __name__ == '__main__':
    uvicorn.run(app)