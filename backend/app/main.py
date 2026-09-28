from fastapi import FastAPI
from app.core.config import settings
from app.api.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered personalized fitness and nutrition platform."
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to BodyIQ API 🚀",
        "version": settings.APP_VERSION
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME
    }