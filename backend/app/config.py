from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="BACKEND_")

    postgres_url: str
    images_dir: str
    previews_dir: str


config = Config()
