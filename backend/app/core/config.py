from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BodyIQ API"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str
    JWT_SECRET: str
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()