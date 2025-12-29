import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from urllib.parse import urlparse

from app.db import get_db, Base, engine
from app.models import InvoiceJob, JobStatus
from app.schemas import (
    InvoiceCreateResponse,
    InvoiceGetResponse,
    InvoiceConfirmRequest,
    InvoiceConfirmResponse,
    InvoiceValidateRequest,
    InvoiceValidateResponse,
)
from app.storage import save_input_pdf, path_to_url
from app.workers.tasks import process_invoice, finalize_invoice
from app.pipeline.final_json_validate import validate_final_json

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.db import get_db
from app.models import User
from app.schemas import (
    AuthSignupRequest, AuthLoginRequest, AuthGoogleRequest,
    AuthResponse, AuthUserOut
)
from app.security import hash_password, verify_password, create_access_token, get_current_user
from app.config import settings

# Create tables (simple V1; replace with Alembic migrations for prod)
Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["invoices"])


def _download_url(job_id: str) -> str:
    # ⚠️ IMPORTANT: si ton app est montée avec prefix="/v1" dans main.py,
    # alors ici on renvoie "/v1/..." (et non "/v1/v1/...").
    return f"/v1/invoices/{job_id}/download"

def to_user_out(u: User) -> AuthUserOut:
    return AuthUserOut(
        id=u.id,
        email=u.email,
        first_name=u.first_name,
        last_name=u.last_name,
        company=u.company,
    )

@router.post("/invoices", response_model=InvoiceCreateResponse)
async def create_invoice(
    file: UploadFile = File(...),
    profile: str = Form("BASIC_WL"),
    needs_review: bool = Form(False),
    db: Session = Depends(get_db),
):
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Please upload a PDF")

    job_id = str(uuid.uuid4())
    content = await file.read()
    input_path = save_input_pdf(job_id, file.filename, content)

    job = InvoiceJob(
        id=job_id,
        status=JobStatus.UPLOADED,
        profile=profile,
        input_pdf_url=path_to_url(input_path),
    )
    db.add(job)
    db.commit()

    process_invoice.delay(job_id, stop_after_extract=needs_review)
    return InvoiceCreateResponse(job_id=job_id, status=job.status.value)


@router.get("/invoices/{job_id}", response_model=InvoiceGetResponse)
def get_invoice(job_id: str, db: Session = Depends(get_db)):
    job = db.get(InvoiceJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    download_url = None
    if job.status == JobStatus.VALIDATED and job.output_pdf_url:
        download_url = _download_url(job.id)

    return InvoiceGetResponse(
        job_id=job.id,
        status=job.status.value,
        profile=job.profile,
        input_pdf_url=job.input_pdf_url,
        output_pdf_url=job.output_pdf_url,
        output_xml_url=job.output_xml_url,
        download_url=download_url,
        extracted_json=job.extracted_json,
        final_json=job.final_json,
        validation_json=job.validation_json,
        error_message=job.error_message,
    )


# ✅ validation pre-flight côté serveur (utile pour ton UI)
@router.post("/invoices/{job_id}/validate-json", response_model=InvoiceValidateResponse)
def validate_invoice_json(job_id: str, payload: InvoiceValidateRequest, db: Session = Depends(get_db)):
    job = db.get(InvoiceJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    errors, warnings = validate_final_json(payload.final_json or {})
    return InvoiceValidateResponse(ok=(len(errors) == 0), errors=errors, warnings=warnings)


@router.post("/invoices/{job_id}/confirm", response_model=InvoiceConfirmResponse)
def confirm_invoice(job_id: str, payload: InvoiceConfirmRequest, db: Session = Depends(get_db)):
    job = db.get(InvoiceJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # ✅ bloque confirm si JSON invalide -> évite des erreurs worker
    errors, warnings = validate_final_json(payload.final_json or {})
    if errors:
        raise HTTPException(
            status_code=422,
            detail={"message": "final_json invalide", "errors": errors, "warnings": warnings},
        )

    job.final_json = payload.final_json
    job.status = JobStatus.XML_READY
    db.add(job)
    db.commit()

    finalize_invoice.delay(job_id)
    return InvoiceConfirmResponse(job_id=job.id, status=job.status.value)


@router.get("/invoices/{job_id}/download")
def download_facturx(job_id: str, db: Session = Depends(get_db)):
    job = db.get(InvoiceJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != JobStatus.VALIDATED or not job.output_pdf_url:
        raise HTTPException(status_code=404, detail="Output not ready")

    # output_pdf_url peut être "file:///data/<id>/output_facturx.pdf" ou "/data/..."
    u = urlparse(job.output_pdf_url)
    path = u.path if u.scheme == "file" else job.output_pdf_url

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Output file missing on disk: {path}")

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="output_facturx.pdf",
    )

@router.post("/auth/signup", response_model=AuthResponse)
def signup(payload: AuthSignupRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()

    exists = db.query(User).filter(User.email == email).first()
    if exists:
        raise HTTPException(status_code=409, detail="Email already used")

    u = User(
        id=str(uuid.uuid4()),
        email=email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        company=payload.company,
        hashed_password=hash_password(payload.password),
        google_sub=None,
    )
    db.add(u)
    db.commit()

    token = create_access_token(subject=str(u.id))
    return AuthResponse(access_token=token, user=to_user_out(u))

@router.post("/auth/login", response_model=AuthResponse)
def login(payload: AuthLoginRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    u = db.query(User).filter(User.email == email).first()
    if not u or not u.hashed_password or not verify_password(payload.password, u.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=str(u.id))
    return AuthResponse(access_token=token, user=to_user_out(u))

@router.post("/auth/google", response_model=AuthResponse)
def google_login(payload: AuthGoogleRequest, db: Session = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID not configured")

    try:
        info = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            settings.google_client_id,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    # info contient: sub, email, given_name, family_name, name, picture...
    sub = info.get("sub")
    email = (info.get("email") or "").lower()
    if not sub or not email:
        raise HTTPException(status_code=401, detail="Google token missing sub/email")

    u = db.query(User).filter(User.google_sub == sub).first()
    if not u:
        # fallback: si email existe déjà (signup classique), on lie google_sub
        u_by_email = db.query(User).filter(User.email == email).first()
        if u_by_email:
            u_by_email.google_sub = sub
            u = u_by_email
        else:
            u = User(
                id=str(uuid.uuid4()),
                email=email,
                first_name=info.get("given_name"),
                last_name=info.get("family_name"),
                company=None,
                hashed_password=None,  # google-only
                google_sub=sub,
            )
            db.add(u)

        db.commit()

    token = create_access_token(subject=str(u.id))
    return AuthResponse(access_token=token, user=to_user_out(u))

@router.get("/auth/me", response_model=AuthUserOut)
def me(current: User = Depends(get_current_user)):
    return to_user_out(current)
