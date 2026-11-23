from fastapi import FastAPI

import app.database.model_registry
from app.core.config import settings
from app.api.auth import router as auth_router
from app.fitness.router import router as fitness_router
from app.ai.router import router as ai_router
from app.api.users import router as users_router
from app.api.progress import router as progress_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.workouts import router as workouts_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered personalized fitness and nutrition platform."
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(fitness_router)
app.include_router(ai_router)
app.include_router(users_router)
app.include_router(progress_router)
app.include_router(workouts_router)


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