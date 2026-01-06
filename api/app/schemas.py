from __future__ import annotations

from typing import Any

from pydantic import BaseModel, EmailStr, Field


class InvoiceCreateResponse(BaseModel):
    job_id: str
    status: str


class InvoiceGetResponse(BaseModel):
    job_id: str
    status: str
    profile: str

    input_pdf_url: str | None = None

    # conservés (internes / file://)
    output_pdf_url: str | None = None
    output_xml_url: str | None = None

    # ✅ nouveau: URL HTTP pour télécharger
    download_url: str | None = None

    extracted_json: dict[str, Any] | None = None
    final_json: dict[str, Any] | None = None
    validation_json: dict[str, Any] | None = None
    error_message: str | None = None


class InvoiceConfirmRequest(BaseModel):
    final_json: dict[str, Any]


class InvoiceConfirmResponse(BaseModel):
    job_id: str
    status: str


# ✅ nouveau: validation pre-flight
class InvoiceValidateRequest(BaseModel):
    final_json: dict[str, Any] = Field(..., description="Le JSON final à valider avant confirm")


class InvoiceValidateResponse(BaseModel):
    ok: bool
    errors: list[str] = []
    warnings: list[str] = []


class AuthSignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str | None = None
    last_name: str | None = None
    company: str | None = None


class AuthLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthGoogleRequest(BaseModel):
    id_token: str


class AuthUserOut(BaseModel):
    id: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    company: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserOut


class BillingCheckoutRequest(BaseModel):
    kind: str = Field(..., description="pack | subscription")
    sku: str = Field(
        ...,
        description="Pack SKU (pack_20|pack_100|pack_500) or subscription SKU (starter|pro|business)",
    )
    success_url: str | None = None
    cancel_url: str | None = None


class BillingCheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class BillingSyncSessionRequest(BaseModel):
    session_id: str


class BillingSyncSessionResponse(BaseModel):
    ok: bool
    applied: bool
    duplicate: bool
    kind: str | None = None
    sku: str | None = None


class CreditsBreakdown(BaseModel):
    free_quota: int
    free_used: int
    free_remaining: int
    subscription_quota: int
    subscription_used: int
    subscription_remaining: int
    paid_credits: int


class BillingCreditsResponse(BaseModel):
    plan: str
    credits_available: int
    renewal_date: str
    breakdown: CreditsBreakdown


class BillingConsumeRequest(BaseModel):
    amount: int = Field(default=1, ge=1, le=100)
    job_id: str | None = None


class BillingConsumeResponse(BaseModel):
    ok: bool
    consumed: int
    credits_available: int
    breakdown: CreditsBreakdown
