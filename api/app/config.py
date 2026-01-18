from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/pontfacturx"
    redis_url: str = "redis://localhost:6379/0"

    storage_driver: str = "local"  # local | s3 (future)
    storage_local_root: str = "/data"

    default_profile: str = "BASIC_WL"

    # Validators
    en16931_validators_root: str = "/app/app/validators/schematron/en16931"
    enable_schematron: bool = False
    enable_verapdf: bool = False

    # PDF/A conversion (Ghostscript)
    enable_pdfa_convert: bool = False

    # ✅ JWT (aliases pour env + compat security.py)
    jwt_secret: str = Field(default="9a4d73a0d3258ecb4f0bb186eb32f0f7", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")

    # ✅ Le champ utilisé par security.py
    jwt_access_token_minutes: int = Field(default=60 * 24 * 7, alias="JWT_ACCESS_TOKEN_MINUTES")

    # ✅ compat si ailleurs tu utilises jwt_exp_minutes
    jwt_exp_minutes: int = Field(default=60 * 24 * 7, alias="JWT_EXP_MINUTES")

    google_client_id: str = Field(
        default="187219964758-0brb98n8feksjulqpdgk8iegvqijr395.apps.googleusercontent.com",
        validation_alias=AliasChoices("GOOGLE_CLIENT_ID", "NEXT_PUBLIC_GOOGLE_CLIENT_ID"),
    )

    cors_origins: list[str] = ["http://localhost:3000"]

    # Email / Resend
    resend_api_key: str = Field(default="", alias="RESEND_API_KEY")
    email_from: str = Field(default="Factur-X Convert <noreply@pont-facturx.com>", alias="EMAIL_FROM")

    # Stripe billing
    stripe_secret_key: str = Field(default="", alias="STRIPE_SECRET_KEY")
    stripe_webhook_secret: str = Field(default="", alias="STRIPE_WEBHOOK_SECRET")
    webapp_url: str = Field(default="http://localhost:3000", alias="WEBAPP_URL")

    # Stripe Price IDs (optional but recommended)
    # Packs
    stripe_price_pack_20: str = Field(default="", alias="STRIPE_PRICE_PACK_20")
    stripe_price_pack_100: str = Field(default="", alias="STRIPE_PRICE_PACK_100")
    stripe_price_pack_500: str = Field(default="", alias="STRIPE_PRICE_PACK_500")

    # Subscriptions (monthly)
    stripe_price_sub_starter: str = Field(default="", alias="STRIPE_PRICE_SUB_STARTER")
    stripe_price_sub_pro: str = Field(default="", alias="STRIPE_PRICE_SUB_PRO")
    stripe_price_sub_business: str = Field(default="", alias="STRIPE_PRICE_SUB_BUSINESS")
    # Subscriptions (annual)
    stripe_price_sub_starter_annual: str = Field(
        default="",
        alias="STRIPE_PRICE_SUB_STARTER_ANNUAL",
    )
    stripe_price_sub_pro_annual: str = Field(
        default="",
        alias="STRIPE_PRICE_SUB_PRO_ANNUAL",
    )
    stripe_price_sub_business_annual: str = Field(
        default="",
        alias="STRIPE_PRICE_SUB_BUSINESS_ANNUAL",
    )

    class Config:
        env_prefix = ""
        case_sensitive = False


settings = Settings()
