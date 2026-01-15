import base64
import json
import os
import shutil
import uuid
import logging
from datetime import UTC, datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

import stripe

from app.config import settings
from app.db import get_db
from app.models import BillingAccount, BillingEvent, ConversionRecord, InvoiceJob, JobStatus, User
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
    BillingCheckoutRequest,
    BillingCheckoutResponse,
    BillingSyncSessionRequest,
    BillingConsumeRequest,
    BillingConsumeResponse,
    BillingOverviewResponse,
    BillingSubscriptionSummary,
    BillingInvoiceSummary,
    BillingCreditsResponse,
    CreditsBreakdown,
    ConversionArchiveRequest,
    ConversionArchiveResponse,
    ConversionListResponse,
    ConversionSummary,
)
from app.security import create_access_token, get_current_user, hash_password, verify_password
from app.storage import path_to_url, save_input_pdf
from app.workers.tasks import finalize_invoice, process_invoice

router = APIRouter(tags=["invoices"])

logger = logging.getLogger(__name__)


ALLOWED_FACTURX_PROFILES = {"BASIC", "BASIC_WL", "EN16931", "EXTENDED"}

CONVERSION_RETENTION_DAYS = 180


PACKS: dict[str, dict] = {
    "pack_20": {"credits": 20, "name": "Pack 20 crédits"},
    "pack_100": {"credits": 100, "name": "Pack 100 crédits"},
    "pack_500": {"credits": 500, "name": "Pack 500 crédits"},
}

SUBSCRIPTIONS: dict[str, dict] = {
    "starter": {"credits": 60, "name": "Starter", "plan": "starter", "cycle": "monthly"},
    "starter_annual": {"credits": 60, "name": "Starter", "plan": "starter", "cycle": "annual"},
    "pro": {"credits": 200, "name": "Pro", "plan": "pro", "cycle": "monthly"},
    "pro_annual": {"credits": 200, "name": "Pro", "plan": "pro", "cycle": "annual"},
    "business": {"credits": 500, "name": "Business", "plan": "business", "cycle": "monthly"},
    "business_annual": {"credits": 500, "name": "Business", "plan": "business", "cycle": "annual"},
}


def _current_period(now: datetime | None = None) -> str:
    now = now or datetime.now(UTC)
    return f"{now.year:04d}-{now.month:02d}"


def _renewal_date_iso(now: datetime | None = None) -> str:
    now = now or datetime.now(UTC)
    if now.month == 12:
        renewal = datetime(now.year + 1, 1, 1, tzinfo=UTC)
    else:
        renewal = datetime(now.year, now.month + 1, 1, tzinfo=UTC)
    return renewal.isoformat()


def _ensure_billing_account(db: Session, user_id: str) -> BillingAccount:
    acct = db.get(BillingAccount, user_id)
    if acct:
        return acct
    acct = BillingAccount(user_id=user_id)
    db.add(acct)
    db.flush()
    return acct


def _sync_credits_periods(acct: BillingAccount, *, now: datetime | None = None) -> None:
    now = now or datetime.now(UTC)
    period = _current_period(now)

    if acct.free_period != period:
        acct.free_period = period
        acct.free_quota = 3
        acct.free_used = 0
    else:
        # Defensive defaults: if a row was created with missing/incorrect values,
        # keep the current period but ensure the free monthly quota is present.
        if acct.free_quota is None or int(acct.free_quota) <= 0:
            acct.free_quota = 3
        if acct.free_used is None or int(acct.free_used) < 0:
            acct.free_used = 0

    sub_active = (acct.subscription_status or "").lower() in {"active", "trialing"}
    if not sub_active:
        acct.sub_quota = 0
        acct.sub_used = 0
        acct.sub_period = period
        return

    plan = (acct.subscription_plan or "").lower()
    quota = int(SUBSCRIPTIONS.get(plan, {}).get("credits", 0))
    if acct.sub_period != period:
        acct.sub_period = period
        acct.sub_used = 0
    acct.sub_quota = quota


def _credits_breakdown(acct: BillingAccount) -> CreditsBreakdown:
    free_quota = int(acct.free_quota or 0)
    free_used = int(acct.free_used or 0)
    sub_quota = int(acct.sub_quota or 0)
    sub_used = int(acct.sub_used or 0)
    paid = max(0, int(acct.paid_credits or 0))

    free_remaining = max(0, free_quota - free_used)
    sub_remaining = max(0, sub_quota - sub_used)

    return CreditsBreakdown(
        free_quota=free_quota,
        free_used=free_used,
        free_remaining=free_remaining,
        subscription_quota=sub_quota,
        subscription_used=sub_used,
        subscription_remaining=sub_remaining,
        paid_credits=paid,
    )


def _credits_available(b: CreditsBreakdown) -> int:
    return int(b.free_remaining) + int(b.subscription_remaining) + int(b.paid_credits)


def _record_billing_event(
    db: Session,
    *,
    event_id: str | None,
    user_id: str | None,
    kind: str,
    credits_delta: int = 0,
    data: dict | None = None,
) -> None:
    if not event_id:
        return
    db.add(
        BillingEvent(
            stripe_event_id=event_id,
            user_id=user_id,
            kind=kind,
            credits_delta=int(credits_delta),
            data=data,
        )
    )


def _conversion_archive_root() -> Path:
    base = Path(settings.storage_local_root)
    archive = base / "archive"
    archive.mkdir(parents=True, exist_ok=True)
    return archive


def _conversion_record_dir(record_id: str) -> Path:
    path = _conversion_archive_root() / record_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def _purge_expired_conversions(db: Session) -> None:
    now = datetime.now(UTC)
    expired = (
        db.query(ConversionRecord)
        .filter(ConversionRecord.expires_at.isnot(None))
        .filter(ConversionRecord.expires_at < now)
        .all()
    )
    if not expired:
        return

    for record in expired:
        record_dir = None
        if record.pdf_path:
            record_dir = Path(record.pdf_path).parent
        elif record.xml_path:
            record_dir = Path(record.xml_path).parent
        try:
            for path in [record.pdf_path, record.xml_path]:
                if path and os.path.exists(path):
                    os.remove(path)
        except OSError:
            pass
        if record_dir and record_dir.exists():
            try:
                shutil.rmtree(record_dir)
            except OSError:
                pass
        db.delete(record)
    db.commit()


def _conversion_to_summary(record: ConversionRecord) -> ConversionSummary:
    created_at = record.created_at or datetime.now(UTC)
    return ConversionSummary(
        id=record.id,
        file_name=record.file_name,
        profile=record.profile,
        status=record.status,
        created_at=created_at,
        expires_at=record.expires_at,
        invoice_number=record.invoice_number,
        client_name=record.client_name,
        amount_total=record.amount_total,
        currency=record.currency,
    )


def _apply_checkout_completed(
    db: Session,
    *,
    event_id: str | None,
    metadata: dict,
    customer_id: str | None,
    subscription_id: str | None,
) -> dict:
    user_id = (metadata.get("user_id") or "").strip() or None
    if not user_id:
        _record_billing_event(db, event_id=event_id, user_id=None, kind="unknown", data={"missing": "user_id"})
        return {"ok": True, "applied": False}

    acct = _ensure_billing_account(db, user_id)
    _sync_credits_periods(acct)

    if customer_id and not acct.stripe_customer_id:
        acct.stripe_customer_id = customer_id

    kind = (metadata.get("kind") or "").lower()
    sku = metadata.get("sku")

    if kind == "pack":
        credits = int(metadata.get("credits") or 0)
        acct.paid_credits = int(acct.paid_credits or 0) + credits
        _record_billing_event(
            db,
            event_id=event_id,
            user_id=user_id,
            kind="pack_credit",
            credits_delta=credits,
            data={"sku": sku, "customer": customer_id},
        )
        return {"ok": True, "applied": True, "kind": "pack", "sku": sku}

    if kind == "subscription":
        acct.stripe_subscription_id = subscription_id or acct.stripe_subscription_id
        acct.subscription_plan = metadata.get("plan") or sku
        acct.subscription_status = (metadata.get("subscription_status") or "active")
        acct.sub_quota = int(metadata.get("credits_per_month") or 0)
        acct.sub_period = _current_period()
        acct.sub_used = 0
        _record_billing_event(
            db,
            event_id=event_id,
            user_id=user_id,
            kind="subscription_credit",
            credits_delta=0,
            data={
                "plan": acct.subscription_plan,
                "subscription": acct.stripe_subscription_id,
                "customer": customer_id,
            },
        )
        return {"ok": True, "applied": True, "kind": "subscription", "sku": sku}

    _record_billing_event(db, event_id=event_id, user_id=user_id, kind="unknown", data={"kind": kind, "sku": sku})
    return {"ok": True, "applied": False, "kind": kind, "sku": sku}


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


@router.get("/billing/credits", response_model=BillingCreditsResponse)
def billing_credits(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    acct = _ensure_billing_account(db, user.id)
    _sync_credits_periods(acct)
    db.commit()
    db.refresh(acct)

    breakdown = _credits_breakdown(acct)
    available = _credits_available(breakdown)

    plan = "Plan gratuit"
    sub_active = (acct.subscription_status or "").lower() in {"active", "trialing"}
    if sub_active:
        plan = f"Abonnement {(acct.subscription_plan or '').capitalize()}"

    renewal_date: str | None = None
    renewal_label: str | None = None
    if sub_active and settings.stripe_secret_key:
        stripe.api_key = settings.stripe_secret_key

        # If the account is marked as active but we don't have a subscription id stored yet,
        # try to recover it from Stripe using the customer id.
        subscription_id = acct.stripe_subscription_id
        if not subscription_id and not acct.stripe_customer_id and (user.email or "").strip():
            # Older accounts may have missing Stripe ids in DB; attempt a safe recovery via email.
            # Prefer subscriptions whose metadata.user_id matches, but fall back to customer email match.
            try:
                email_norm = (user.email or "").strip().lower()
                customers = stripe.Customer.list(email=email_norm, limit=10)
                for c in list(getattr(customers, "data", None) or []):
                    cid = getattr(c, "id", None)
                    if not cid:
                        continue
                    customer_email = (getattr(c, "email", None) or "").strip().lower()
                    subs = stripe.Subscription.list(customer=cid, status="all", limit=10)
                    best = None
                    best_meta = None
                    for s in list(getattr(subs, "data", None) or []):
                        status = (getattr(s, "status", None) or "").strip().lower()
                        meta = getattr(s, "metadata", None) or {}
                        meta_user_id = (meta.get("user_id") or "").strip()
                        if meta_user_id and meta_user_id != str(user.id):
                            continue
                        if not meta_user_id and customer_email != email_norm:
                            continue
                        if status in {"active", "trialing"}:
                            best = s
                            best_meta = meta
                            break
                    if best and getattr(best, "id", None):
                        acct.stripe_customer_id = str(cid)
                        subscription_id = str(best.id)
                        acct.stripe_subscription_id = subscription_id
                        if getattr(best, "status", None):
                            acct.subscription_status = str(best.status)
                        try:
                            plan_from_meta = (
                                (best_meta or {}).get("plan") if best_meta else None
                            )
                            if plan_from_meta:
                                acct.subscription_plan = str(plan_from_meta).strip()
                        except Exception:
                            pass
                        db.commit()
                        db.refresh(acct)
                        break
            except Exception as e:
                logger.warning(
                    "billing_credits failed_to_recover_customer_by_email user_id=%s err=%s",
                    user.id,
                    str(e),
                )

        if not subscription_id and acct.stripe_customer_id:
            try:
                subs = stripe.Subscription.list(
                    customer=acct.stripe_customer_id,
                    status="all",
                    limit=10,
                )
                best = None
                for s in list(getattr(subs, "data", None) or []):
                    status = (getattr(s, "status", None) or "").strip().lower()
                    if status in {"active", "trialing"}:
                        best = s
                        break
                if best and getattr(best, "id", None):
                    subscription_id = str(best.id)
                    acct.stripe_subscription_id = subscription_id
                    if getattr(best, "status", None):
                        acct.subscription_status = str(best.status)
                    try:
                        meta = getattr(best, "metadata", None) or {}
                        plan_from_meta = (meta.get("plan") or "").strip()
                        if plan_from_meta:
                            acct.subscription_plan = plan_from_meta
                    except Exception:
                        pass
                    db.commit()
                    db.refresh(acct)
            except Exception as e:
                logger.warning(
                    "billing_credits failed_to_list_subscriptions user_id=%s customer_id=%s err=%s",
                    user.id,
                    acct.stripe_customer_id,
                    str(e),
                )

        if subscription_id:
            try:
                sub = stripe.Subscription.retrieve(subscription_id)
                sub_status = (getattr(sub, "status", None) or "").strip().lower()
                cancel_at_period_end = bool(getattr(sub, "cancel_at_period_end", False))

                # Stripe semantics:
                # - current_period_end: end of current period; next renewal date if not canceling.
                # - if cancel_at_period_end: subscription won't renew; we should show an end date.
                # - during trial, current_period_end may correspond to trial end; prefer trial_end if present.
                ts = None
                trial_end = getattr(sub, "trial_end", None)
                current_period_end = getattr(sub, "current_period_end", None)
                if sub_status == "trialing" and trial_end:
                    ts = trial_end
                    renewal_label = "Fin d’essai"
                else:
                    ts = current_period_end
                    renewal_label = "Se termine" if cancel_at_period_end else "Renouvellement"

                if ts:
                    renewal_date = datetime.fromtimestamp(int(ts), tz=UTC).isoformat()
            except Exception as e:
                logger.warning(
                    "billing_credits failed_to_retrieve_subscription user_id=%s subscription_id=%s err=%s",
                    user.id,
                    subscription_id,
                    str(e),
                )

    logger.info(
        "billing_credits summary user_id=%s sub_active=%s plan=%s subscription_id=%s renewal_date=%s renewal_label=%s",
        user.id,
        sub_active,
        acct.subscription_plan,
        acct.stripe_subscription_id,
        renewal_date,
        renewal_label,
    )

    return BillingCreditsResponse(
        plan=plan,
        credits_available=available,
        renewal_date=renewal_date,
        renewal_label=renewal_label,
        breakdown=breakdown,
    )


@router.get("/billing/overview", response_model=BillingOverviewResponse)
def billing_overview(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    stripe.api_key = settings.stripe_secret_key

    acct = _ensure_billing_account(db, user.id)
    _sync_credits_periods(acct)

    if not acct.stripe_customer_id and (user.email or "").strip():
        try:
            email_norm = (user.email or "").strip().lower()
            customers = stripe.Customer.list(email=email_norm, limit=1)
            for c in list(getattr(customers, "data", None) or []):
                cid = getattr(c, "id", None)
                if cid:
                    acct.stripe_customer_id = str(cid)
                    db.commit()
                    db.refresh(acct)
                    break
        except Exception:
            pass

    subscription_summary = None
    sub = None
    if acct.stripe_subscription_id:
        try:
            sub = stripe.Subscription.retrieve(acct.stripe_subscription_id)
        except Exception:
            sub = None

    if not sub and acct.stripe_customer_id:
        try:
            subs = stripe.Subscription.list(
                customer=acct.stripe_customer_id,
                status="all",
                limit=5,
            )
            data_subs = list(getattr(subs, "data", None) or [])
            if data_subs:
                sub = data_subs[0]
        except Exception:
            sub = None

    if sub:
        try:
            status = (getattr(sub, "status", None) or "").strip().lower() or None
            cancel_at_period_end = bool(getattr(sub, "cancel_at_period_end", False))
            current_period_end = getattr(sub, "current_period_end", None)
            ts = None
            if current_period_end:
                try:
                    ts = datetime.fromtimestamp(int(current_period_end), tz=UTC).isoformat()
                except Exception:
                    ts = None

            price = None
            items = getattr(sub, "items", None)
            data_items = list(getattr(items, "data", None) or []) if items else []
            if data_items:
                price = getattr(data_items[0], "price", None)

            amount = getattr(price, "unit_amount", None) if price else None
            currency = getattr(price, "currency", None) if price else None
            recurring = getattr(price, "recurring", None) if price else None
            interval = getattr(recurring, "interval", None) if recurring else None
            interval_count = getattr(recurring, "interval_count", None) if recurring else None

            metadata = getattr(sub, "metadata", None) or {}
            plan_from_meta = (metadata.get("plan") or "").strip() if isinstance(metadata, dict) else ""
            plan_from_db = (acct.subscription_plan or "").strip()
            plan = plan_from_meta or plan_from_db

            if not plan and price:
                nickname = getattr(price, "nickname", None) or ""
                plan = str(nickname).strip() if nickname else None

            if plan:
                plan = plan.replace("_", " ").strip().title()

            subscription_summary = BillingSubscriptionSummary(
                plan=plan,
                status=status,
                is_active=status in {"active", "trialing"} if status else False,
                current_period_end=ts,
                cancel_at_period_end=cancel_at_period_end,
                amount=amount,
                currency=currency,
                interval=interval,
                interval_count=interval_count,
            )
        except Exception:
            subscription_summary = None

    invoices: list[BillingInvoiceSummary] = []
    if acct.stripe_customer_id:
        try:
            stripe_invoices = stripe.Invoice.list(
                customer=acct.stripe_customer_id,
                limit=10,
            )
            for inv in list(getattr(stripe_invoices, "data", None) or []):
                created_ts = getattr(inv, "created", None)
                created_iso = None
                if created_ts:
                    try:
                        created_iso = datetime.fromtimestamp(int(created_ts), tz=UTC).isoformat()
                    except Exception:
                        created_iso = None
                invoices.append(
                    BillingInvoiceSummary(
                        id=str(getattr(inv, "id", "")),
                        number=getattr(inv, "number", None),
                        status=getattr(inv, "status", None),
                        amount_paid=getattr(inv, "amount_paid", None),
                        currency=getattr(inv, "currency", None),
                        hosted_invoice_url=getattr(inv, "hosted_invoice_url", None),
                        invoice_pdf=getattr(inv, "invoice_pdf", None),
                        created=created_iso,
                    )
                )
        except Exception:
            invoices = []

    return BillingOverviewResponse(subscription=subscription_summary, invoices=invoices)


@router.post("/billing/consume", response_model=BillingConsumeResponse)
def billing_consume(
    payload: BillingConsumeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    acct = _ensure_billing_account(db, user.id)
    _sync_credits_periods(acct)

    amount = int(payload.amount or 1)
    sources: list[str] = []
    for _ in range(amount):
        breakdown = _credits_breakdown(acct)
        if breakdown.free_remaining > 0:
            acct.free_used = int(acct.free_used or 0) + 1
            sources.append("free")
        elif breakdown.subscription_remaining > 0:
            acct.sub_used = int(acct.sub_used or 0) + 1
            sources.append("subscription")
        elif breakdown.paid_credits > 0:
            acct.paid_credits = int(acct.paid_credits or 0) - 1
            sources.append("paid")
        else:
            raise HTTPException(status_code=402, detail="No credits available")

    db.add(
        BillingEvent(
            stripe_event_id=str(uuid.uuid4()),
            user_id=user.id,
            kind="consume",
            credits_delta=-amount,
            data={"job_id": payload.job_id, "sources": sources},
        )
    )
    db.commit()
    db.refresh(acct)

    breakdown = _credits_breakdown(acct)
    return BillingConsumeResponse(
        ok=True,
        consumed=amount,
        credits_available=_credits_available(breakdown),
        breakdown=breakdown,
    )


@router.post("/conversions/archive", response_model=ConversionArchiveResponse)
def conversions_archive(
    payload: ConversionArchiveRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _purge_expired_conversions(db)

    pdf_data = (payload.pdf_base64 or "").strip()
    if not pdf_data:
        raise HTTPException(status_code=400, detail="Missing pdf_base64")

    try:
        pdf_bytes = base64.b64decode(pdf_data, validate=True)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid pdf_base64")

    record_id = str(uuid.uuid4())
    record_dir = _conversion_record_dir(record_id)
    pdf_path = record_dir / "facturx.pdf"
    pdf_path.write_bytes(pdf_bytes)

    xml_path = None
    xml_payload = (payload.xml or "").strip()
    if xml_payload:
        xml_path = record_dir / "invoice.xml"
        xml_path.write_text(xml_payload, encoding="utf-8")

    expires_at = datetime.now(UTC) + timedelta(days=CONVERSION_RETENTION_DAYS)
    metadata = payload.metadata.copy() if payload.metadata else {}
    metadata.setdefault("source_file_id", payload.file_id)

    record = ConversionRecord(
        id=record_id,
        user_id=user.id,
        file_name=payload.file_name or payload.file_id,
        invoice_number=payload.invoice_number,
        client_name=payload.client_name,
        amount_total=payload.amount_total,
        currency=payload.currency,
        profile=(payload.profile or settings.default_profile),
        status=(payload.status or "ready"),
        pdf_path=str(pdf_path),
        xml_path=str(xml_path) if xml_path else None,
        metadata_json=metadata,
        expires_at=expires_at,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    logger.info(
        "conversions_archive stored user_id=%s record_id=%s expires_at=%s",
        user.id,
        record.id,
        record.expires_at,
    )

    return ConversionArchiveResponse(
        id=record.id,
        file_name=record.file_name,
        profile=record.profile,
        status=record.status,
        created_at=record.created_at or datetime.now(UTC),
        expires_at=record.expires_at,
    )


@router.get("/conversions", response_model=ConversionListResponse)
def conversions_list(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _purge_expired_conversions(db)

    records = (
        db.query(ConversionRecord)
        .filter(ConversionRecord.user_id == user.id)
        .order_by(ConversionRecord.created_at.desc())
        .limit(500)
        .all()
    )

    return ConversionListResponse(items=[_conversion_to_summary(r) for r in records])


@router.get("/conversions/{record_id}/{kind}")
def conversions_download(
    record_id: str,
    kind: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _purge_expired_conversions(db)

    record = db.get(ConversionRecord, record_id)
    if not record or record.user_id != user.id:
        raise HTTPException(status_code=404, detail="Conversion not found")

    target_path = None
    media_type = None
    filename = None
    kind_norm = (kind or "").strip().lower()
    if kind_norm == "pdf":
        target_path = record.pdf_path
        media_type = "application/pdf"
        filename = "facturx.pdf"
    elif kind_norm == "xml":
        target_path = record.xml_path
        media_type = "application/xml"
        filename = "invoice.xml"
    else:
        raise HTTPException(status_code=400, detail="Unsupported download kind")

    if not target_path or not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="Requested file not available")

    return FileResponse(path=target_path, media_type=media_type, filename=filename)

@router.post("/billing/checkout", response_model=BillingCheckoutResponse)
def billing_checkout(
    payload: BillingCheckoutRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    stripe.api_key = settings.stripe_secret_key

    kind = (payload.kind or "").strip().lower()
    sku = (payload.sku or "").strip().lower()

    acct = _ensure_billing_account(db, user.id)
    _sync_credits_periods(acct)

    success_url = payload.success_url or f"{settings.webapp_url}/dashboard?checkout=success"
    cancel_url = payload.cancel_url or f"{settings.webapp_url}/dashboard?checkout=cancel"

    pack_price_ids = {
        "pack_20": settings.stripe_price_pack_20,
        "pack_100": settings.stripe_price_pack_100,
        "pack_500": settings.stripe_price_pack_500,
    }
    sub_price_ids = {
        "starter": (settings.stripe_price_sub_starter or "").strip(),
        "starter_annual": (settings.stripe_price_sub_starter_annual or "").strip(),
        "pro": (settings.stripe_price_sub_pro or "").strip(),
        "pro_annual": (settings.stripe_price_sub_pro_annual or "").strip(),
        "business": (settings.stripe_price_sub_business or "").strip(),
        "business_annual": (settings.stripe_price_sub_business_annual or "").strip(),
    }
    sub_price_env = {
        "starter": "STRIPE_PRICE_SUB_STARTER",
        "starter_annual": "STRIPE_PRICE_SUB_STARTER_ANNUAL",
        "pro": "STRIPE_PRICE_SUB_PRO",
        "pro_annual": "STRIPE_PRICE_SUB_PRO_ANNUAL",
        "business": "STRIPE_PRICE_SUB_BUSINESS",
        "business_annual": "STRIPE_PRICE_SUB_BUSINESS_ANNUAL",
    }

    if kind == "pack":
        pack = PACKS.get(sku)
        if not pack:
            raise HTTPException(status_code=400, detail="Unknown pack sku")

        metadata = {
            "kind": "pack",
            "sku": sku,
            "credits": str(pack["credits"]),
            "user_id": user.id,
        }

        price_id = (pack_price_ids.get(sku) or "").strip()
        if not price_id:
            raise HTTPException(
                status_code=500,
                detail=f"Missing Stripe Price ID env for pack '{sku}' (expected STRIPE_PRICE_PACK_20/100/500)",
            )

        try:
            session = stripe.checkout.Session.create(
                mode="payment",
                customer=acct.stripe_customer_id or None,
                # customer_creation=None if acct.stripe_customer_id else "always",
                client_reference_id=user.id,
                metadata=metadata,
                line_items=[{"quantity": 1, "price": price_id}],
                success_url=success_url,
                cancel_url=cancel_url,
            )
        except stripe.error.InvalidRequestError as e:
            msg = str(getattr(e, "user_message", None) or getattr(e, "message", None) or e)
            raise HTTPException(
                status_code=500,
                detail=f"Stripe error for pack '{sku}' price_id '{price_id}': {msg}",
            )
        return BillingCheckoutResponse(checkout_url=session.url, session_id=session.id)

    if kind == "subscription":
        sub = SUBSCRIPTIONS.get(sku)
        if not sub:
            raise HTTPException(status_code=400, detail="Unknown subscription sku")

        plan_slug = (sub.get("plan") or sku).strip() or sku
        metadata = {
            "kind": "subscription",
            "sku": sku,
            "plan": plan_slug,
            "billing_cycle": sub.get("cycle") or "monthly",
            "credits_per_month": str(sub["credits"]),
            "user_id": user.id,
        }

        price_id = sub_price_ids.get(sku) or ""
        if not price_id:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Missing Stripe Price ID env for subscription '{sku}'"
                    f" (expected {sub_price_env.get(sku, 'STRIPE_PRICE_SUB_<SKU>')})"
                ),
            )

        try:
            session = stripe.checkout.Session.create(
                mode="subscription",
                customer=acct.stripe_customer_id or None,
                client_reference_id=user.id,
                metadata=metadata,
                subscription_data={"metadata": metadata},
                line_items=[{"quantity": 1, "price": price_id}],
                success_url=success_url,
                cancel_url=cancel_url,
            )
        except stripe.error.InvalidRequestError as e:
            msg = str(getattr(e, "user_message", None) or getattr(e, "message", None) or e)
            raise HTTPException(
                status_code=500,
                detail=f"Stripe error for subscription '{sku}' price_id '{price_id}': {msg}",
            )
        return BillingCheckoutResponse(checkout_url=session.url, session_id=session.id)

    raise HTTPException(status_code=400, detail="Invalid kind")


@router.post("/billing/sync-session")
def billing_sync_session(
    payload: BillingSyncSessionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Best-effort reconciliation after Stripe redirect.

    Webhooks are the primary source of truth, but in production they can be delayed
    or misconfigured. This endpoint allows the webapp to sync immediately after
    the user returns from Stripe, without double-crediting.
    """

    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    stripe.api_key = settings.stripe_secret_key

    session_id = (payload.session_id or "").strip()
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")

    masked_session = f"…{session_id[-8:]}" if len(session_id) > 8 else session_id
    logger.info("billing_sync_session start user_id=%s session=%s", user.id, masked_session)

    def _payment_status_allows_fulfillment(session_obj: dict, *, kind: str) -> bool:
        payment_status = (session_obj.get("payment_status") or "").strip().lower()
        if not payment_status:
            # Fallback for older/edge cases: don't fulfill unless explicitly complete.
            return (session_obj.get("status") or "").strip().lower() == "complete"
        if kind == "pack":
            return payment_status == "paid"
        return payment_status in {"paid", "no_payment_required"}

    # Idempotency: never apply twice for the same checkout session.
    synthetic_event_id = f"sync:{session_id}"
    if db.get(BillingEvent, synthetic_event_id):
        acct = _ensure_billing_account(db, user.id)
        _sync_credits_periods(acct)
        breakdown = _credits_breakdown(acct)
        logger.info(
            "billing_sync_session duplicate user_id=%s session=%s", user.id, masked_session
        )
        return {
            "ok": True,
            "applied": False,
            "duplicate": True,
            "credits_available": _credits_available(breakdown),
            "breakdown": breakdown.model_dump(),
        }

    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        logger.warning(
            "billing_sync_session invalid_session user_id=%s session=%s",
            user.id,
            masked_session,
        )
        raise HTTPException(status_code=400, detail="Invalid session_id")

    obj = session if isinstance(session, dict) else getattr(session, "_values", {}) or {}
    metadata = (obj.get("metadata") or {}) if isinstance(obj, dict) else {}

    metadata_user_id = (metadata.get("user_id") or "").strip()
    if metadata_user_id and metadata_user_id != str(user.id):
        logger.warning(
            "billing_sync_session forbidden user_id=%s session=%s metadata_user_id=%s",
            user.id,
            masked_session,
            metadata_user_id,
        )
        raise HTTPException(status_code=403, detail="Session does not belong to current user")

    # Legacy compatibility: older checkouts may not have metadata.user_id.
    if not metadata_user_id:
        session_email = (
            (getattr(getattr(session, "customer_details", None), "email", None) or "")
            or (getattr(session, "customer_email", None) or "")
        )
        if (session_email or "").strip().lower() != (user.email or "").strip().lower():
            raise HTTPException(
                status_code=400,
                detail="Stripe session is missing metadata.user_id and cannot be linked to the current user",
            )

        try:
            items = stripe.checkout.Session.list_line_items(session_id, limit=10)
            data_items = list(getattr(items, "data", None) or [])
        except Exception:
            data_items = []

        price_ids: list[str] = []
        for it in data_items:
            price = getattr(it, "price", None)
            pid = getattr(price, "id", None) if price else None
            if isinstance(pid, str) and pid.strip():
                price_ids.append(pid.strip())

        if not price_ids:
            raise HTTPException(status_code=400, detail="Unable to infer purchase from Stripe session line items")

        pack_price_map = {
            (settings.stripe_price_pack_20 or "").strip(): "pack_20",
            (settings.stripe_price_pack_100 or "").strip(): "pack_100",
            (settings.stripe_price_pack_500 or "").strip(): "pack_500",
        }
        sub_price_map = {
            (settings.stripe_price_sub_starter or "").strip(): "starter",
            (settings.stripe_price_sub_starter_annual or "").strip(): "starter_annual",
            (settings.stripe_price_sub_pro or "").strip(): "pro",
            (settings.stripe_price_sub_pro_annual or "").strip(): "pro_annual",
            (settings.stripe_price_sub_business or "").strip(): "business",
            (settings.stripe_price_sub_business_annual or "").strip(): "business_annual",
        }

        primary_price_id = price_ids[0]
        if primary_price_id in pack_price_map:
            inferred_sku = pack_price_map[primary_price_id]
            pack = PACKS.get(inferred_sku)
            metadata = {
                "kind": "pack",
                "sku": inferred_sku,
                "credits": str(int(pack["credits"]) if pack else 0),
                "user_id": user.id,
                "_recovered_from_email": "1",
            }
        elif primary_price_id in sub_price_map:
            inferred_sku = sub_price_map[primary_price_id]
            sub = SUBSCRIPTIONS.get(inferred_sku)
            metadata = {
                "kind": "subscription",
                "sku": inferred_sku,
                "plan": (sub or {}).get("plan") or inferred_sku,
                "billing_cycle": (sub or {}).get("cycle") or "monthly",
                "credits_per_month": str(int(sub["credits"]) if sub else 0),
                "user_id": user.id,
                "_recovered_from_email": "1",
            }
        else:
            raise HTTPException(status_code=400, detail="Stripe session price is not recognized by this backend")

        metadata_user_id = user.id

    kind = (metadata.get("kind") or "").strip().lower()
    if not _payment_status_allows_fulfillment(obj, kind=kind):
        logger.info(
            "billing_sync_session not_paid user_id=%s session=%s kind=%s status=%s payment_status=%s",
            user.id,
            masked_session,
            kind,
            obj.get("status"),
            obj.get("payment_status"),
        )
        raise HTTPException(status_code=409, detail="Checkout session is not paid")

    customer_id = obj.get("customer") or getattr(session, "customer", None)
    subscription_id = obj.get("subscription") or getattr(session, "subscription", None)

    if getattr(session, "mode", None) == "subscription" and not subscription_id:
        raise HTTPException(status_code=409, detail="Subscription is not created yet")

    # Best-effort: attach real subscription status to metadata.
    if subscription_id:
        try:
            sub = stripe.Subscription.retrieve(subscription_id)
            if getattr(sub, "status", None):
                metadata["subscription_status"] = str(sub.status)
        except Exception:
            pass

    result = _apply_checkout_completed(
        db,
        event_id=synthetic_event_id,
        metadata=metadata,
        customer_id=str(customer_id) if customer_id else None,
        subscription_id=str(subscription_id) if subscription_id else None,
    )
    db.commit()

    logger.info(
        "billing_sync_session applied user_id=%s session=%s result=%s",
        user.id,
        masked_session,
        {"applied": result.get("applied"), "kind": result.get("kind"), "sku": result.get("sku")},
    )

    acct = _ensure_billing_account(db, user.id)
    _sync_credits_periods(acct)
    breakdown = _credits_breakdown(acct)
    return {
        **result,
        "duplicate": False,
        "credits_available": _credits_available(breakdown),
        "breakdown": breakdown.model_dump(),
    }


@router.post("/billing/webhook")
async def billing_webhook(request: Request, db: Session = Depends(get_db)):
    if not settings.stripe_webhook_secret or not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe webhook not configured")
    stripe.api_key = settings.stripe_secret_key

    body = await request.body()
    sig = request.headers.get("stripe-signature")
    if not sig:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=body,
            sig_header=sig,
            secret=settings.stripe_webhook_secret,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook")

    event_id = event.get("id")
    if event_id and db.get(BillingEvent, event_id):
        return {"ok": True, "duplicate": True}

    event_type = event.get("type")
    obj = (event.get("data") or {}).get("object") or {}
    metadata = obj.get("metadata") or {}
    user_id = metadata.get("user_id")

    def _payment_status_allows_fulfillment(session_obj: dict, *, kind: str) -> bool:
        payment_status = (session_obj.get("payment_status") or "").strip().lower()
        if not payment_status:
            return (session_obj.get("status") or "").strip().lower() == "complete"
        if kind == "pack":
            return payment_status == "paid"
        return payment_status in {"paid", "no_payment_required"}

    if event_type in {
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
        "checkout.session.async_payment_failed",
    }:
        kind = (metadata.get("kind") or "").strip().lower()
        if not _payment_status_allows_fulfillment(obj, kind=kind):
            _record_billing_event(
                db,
                event_id=event_id,
                user_id=(user_id or None),
                kind="checkout_pending",
                credits_delta=0,
                data={
                    "event_type": event_type,
                    "payment_status": obj.get("payment_status"),
                    "status": obj.get("status"),
                    "sku": metadata.get("sku"),
                    "customer": obj.get("customer"),
                },
            )
            db.commit()
            return {"ok": True}

        customer_id = obj.get("customer")
        subscription_id = obj.get("subscription")

        # Best-effort: enrich subscription status.
        if subscription_id:
            try:
                sub = stripe.Subscription.retrieve(subscription_id)
                if getattr(sub, "status", None):
                    metadata["subscription_status"] = str(sub.status)
            except Exception:
                pass

        result = _apply_checkout_completed(
            db,
            event_id=event_id,
            metadata=metadata,
            customer_id=str(customer_id) if customer_id else None,
            subscription_id=str(subscription_id) if subscription_id else None,
        )
        db.commit()
        return result

    if event_type in {"customer.subscription.updated", "customer.subscription.deleted"}:
        if not user_id:
            _record_billing_event(
                db,
                event_id=event_id,
                user_id=None,
                kind="subscription_update_missing_user",
                data={"event_type": event_type},
            )
            db.commit()
            return {"ok": True}

        acct = _ensure_billing_account(db, user_id)
        status = obj.get("status")
        if status:
            acct.subscription_status = status
        sub_id = obj.get("id")
        if sub_id:
            acct.stripe_subscription_id = sub_id

        _sync_credits_periods(acct)
        _record_billing_event(
            db,
            event_id=event_id,
            user_id=user_id,
            kind="subscription_status",
            credits_delta=0,
            data={"status": status, "subscription": sub_id, "event_type": event_type},
        )
        db.commit()
        return {"ok": True}

    _record_billing_event(
        db,
        event_id=event_id,
        user_id=user_id,
        kind="ignored",
        data={"event_type": event_type},
    )
    db.commit()
    return {"ok": True}



