import base64
import json
import os
import uuid
from pathlib import Path
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.config import settings
from app.db import Base, engine, get_db
from app.models import InvoiceJob, JobStatus, User
from app.pipeline.final_json_validate import validate_final_json
from app.schemas import (
    AuthGoogleRequest,
    AuthLoginRequest,
    AuthResponse,
    AuthSignupRequest,
    AuthUserOut,
    InvoiceConfirmRequest,
    InvoiceConfirmResponse,
    InvoiceCreateResponse,
    InvoiceGetResponse,
    InvoiceValidateRequest,
    InvoiceValidateResponse,
)
from app.security import create_access_token, get_current_user, hash_password, verify_password
from app.storage import path_to_url, save_input_pdf
from app.workers.tasks import finalize_invoice, process_invoice

# Create tables (simple V1; replace with Alembic migrations for prod)
Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["invoices"])


ALLOWED_FACTURX_PROFILES = {"BASIC", "BASIC_WL", "EN16931", "EXTENDED"}


def _split_address_lines(raw: str) -> dict:
    s = (raw or "").strip()
    if not s:
        # BASIC-WL requires postal address + country code. Keep a minimal address.
        return {"country": "FR"}
    lines = [x.strip() for x in s.replace("\r", "").split("\n") if x.strip()]
    line1 = lines[0] if len(lines) >= 1 else None
    line2 = lines[1] if len(lines) >= 2 else None
    return {"line1": line1, "line2": line2, "country": "FR"}


def _digits(value: str) -> str:
    return "".join([c for c in (value or "") if c.isdigit()])


def _map_webapp_invoice_to_basic_wl(invoice_data: dict) -> dict:
    # Maps the Next.js `InvoiceData` shape into the BASIC WL template input.
    seller_siret = _digits(invoice_data.get("vendorSIRET") or "")
    seller_siren = (
        seller_siret[:9]
        if len(seller_siret) >= 9
        else _digits(invoice_data.get("vendorSIREN") or "")
    )
    seller_vat = invoice_data.get("vendorVAT") or None

    return {
        "invoice_number": invoice_data.get("invoiceNumber") or "INV-UNKNOWN",
        "issue_date": invoice_data.get("invoiceDate") or "1970-01-01",
        "due_date": invoice_data.get("dueDate") or None,
        "payment_terms": invoice_data.get("paymentTerms") or None,
        "currency": "EUR",
        "vat_rate": invoice_data.get("vatRate"),
        "seller": {
            # BT-29 (seller identifier): use SIRET/SIREN if available
            "id": seller_siret or seller_siren or None,
            "name": invoice_data.get("vendorName") or "UNKNOWN",
            # BT-31 (VAT identifier)
            "vat_id": seller_vat,
            # BT-30 (legal registration identifier)
            "legal_registration_id": seller_siren or seller_siret or None,
            "address": _split_address_lines(invoice_data.get("vendorAddress") or ""),
        },
        "buyer": {
            "id": None,
            "name": invoice_data.get("clientName") or "UNKNOWN",
            "vat_id": None,
            "address": _split_address_lines(invoice_data.get("clientAddress") or ""),
        },
        "totals": {
            "total_ht": invoice_data.get("amountHT"),
            "total_vat": invoice_data.get("vatAmount"),
            "total_ttc": invoice_data.get("amountTTC"),
        },
    }


@router.post("/invoices/convert-direct")
async def convert_direct(
    file: UploadFile = File(...),
    invoice_data: str = Form(...),
    profile: str = Form("BASIC_WL"),
):
    """Synchronous conversion: PDF + invoice JSON -> PDF/A-3 Factur-X.

    This is designed for the Next.js webapp, which already performs OCR + user validation.
    We only need to:
    - build CII XML (currently BASIC_WL only)
    - convert input PDF to PDF/A-3 (best-effort, Ghostscript)
    - embed XML as an associated file (factur-x library)
    """

    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Please upload a PDF")

    profile_norm = (profile or "BASIC_WL").strip().upper()
    if profile_norm not in ALLOWED_FACTURX_PROFILES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported profile '{profile}'. Allowed: {sorted(ALLOWED_FACTURX_PROFILES)}",
        )

    # V1: only BASIC_WL template exists.
    if profile_norm not in ("BASIC_WL", "BASICWL"):
        raise HTTPException(
            status_code=400,
            detail=f"Profile '{profile_norm}' not implemented yet (only BASIC_WL is available in this backend).",
        )

    try:
        invoice_obj = json.loads(invoice_data or "{}")
        if not isinstance(invoice_obj, dict):
            raise ValueError("invoice_data must be a JSON object")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid invoice_data JSON: {e}")

    try:
        # Store inputs under /data/<job_id>/
        job_id = str(uuid.uuid4())
        out_dir = Path("/data") / job_id
        out_dir.mkdir(parents=True, exist_ok=True)

        pdf_bytes = await file.read()
        if not pdf_bytes or len(pdf_bytes) < 100:
            raise HTTPException(status_code=400, detail="Empty PDF")

        input_pdf_path = out_dir / (file.filename or "input.pdf")
        input_pdf_path.write_bytes(pdf_bytes)

        # Build XML
        from app.pipeline.cii_builder import build_cii_xml
        from app.pipeline.facturx_wrap import wrap_facturx
        from app.pipeline.pdfa import ensure_pdfa3

        mapped = _map_webapp_invoice_to_basic_wl(invoice_obj)
        xml_path = build_cii_xml(job_id, "BASIC_WL", mapped)

        # Convert to PDF/A-3 (if enabled)
        enable_pdfa = os.getenv("ENABLE_PDFA_CONVERT", "0").strip() in (
            "1",
            "true",
            "TRUE",
            "yes",
            "YES",
        )
        pdf_for_wrap = str(input_pdf_path)
        if enable_pdfa:
            pdfa_path = out_dir / "input_pdfa3.pdf"
            pdf_for_wrap = ensure_pdfa3(str(input_pdf_path), str(pdfa_path))

        # Wrap
        output_pdf_path = wrap_facturx(job_id, pdf_for_wrap, xml_path)
    except HTTPException:
        raise
    except Exception as e:
        # Ensure Next.js gets a readable JSON error (instead of a plain 500 text)
        raise HTTPException(
            status_code=500, detail=f"convert-direct failed: {type(e).__name__}: {e}"
        )

    try:
        out_pdf = Path(output_pdf_path).read_bytes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read output PDF: {e}")

    try:
        xml_text = Path(xml_path).read_text(encoding="utf-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read generated XML: {e}")

    return {
        "profile": "BASIC_WL",
        "pdf_base64": base64.b64encode(out_pdf).decode("ascii"),
        "xml": xml_text,
        "validation": {
            "pdfa3_converted": bool(enable_pdfa),
        },
    }


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
def validate_invoice_json(
    job_id: str, payload: InvoiceValidateRequest, db: Session = Depends(get_db)
):
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
