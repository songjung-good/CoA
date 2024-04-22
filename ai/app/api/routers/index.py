from fastapi import APIRouter

router = APIRouter(prefix="")

@router.get("/")
def get():
    return "Hello, World!"

