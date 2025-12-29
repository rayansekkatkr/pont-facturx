from __future__ import annotations
from typing import Any, Dict, Optional, List
from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class InvoiceCreateResponse(BaseModel):
    job_id: str
    status: str


class InvoiceGetResponse(BaseModel):
    job_id: str
    status: str
    profile: str

    input_pdf_url: Optional[str] = None

    # conservés (internes / file://)
    output_pdf_url: Optional[str] = None
    output_xml_url: Optional[str] = None

    # ✅ nouveau: URL HTTP pour télécharger
    download_url: Optional[str] = None

    extracted_json: Optional[Dict[str, Any]] = None
    final_json: Optional[Dict[str, Any]] = None
    validation_json: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None


class InvoiceConfirmRequest(BaseModel):
    final_json: Dict[str, Any]


class InvoiceConfirmResponse(BaseModel):
    job_id: str
    status: str


# ✅ nouveau: validation pre-flight
class InvoiceValidateRequest(BaseModel):
    final_json: Dict[str, Any] = Field(..., description="Le JSON final à valider avant confirm")


class InvoiceValidateResponse(BaseModel):
    ok: bool
    errors: List[str] = []
    warnings: List[str] = []


class AuthSignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None

class AuthLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthGoogleRequest(BaseModel):
    id_token: str

class AuthUserOut(BaseModel):
    id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserOut
