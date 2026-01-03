import base64
import json
import os
import uuid
from datetime import UTC, datetime
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
from app.models import BillingAccount, BillingEvent, InvoiceJob, JobStatus, User
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
    BillingConsumeRequest,
    BillingConsumeResponse,
    BillingCreditsResponse,
    CreditsBreakdown,
)
from app.security import create_access_token, get_current_user, hash_password, verify_password
from app.storage import path_to_url, save_input_pdf
from app.workers.tasks import finalize_invoice, process_invoice

router = APIRouter(tags=["invoices"])


ALLOWED_FACTURX_PROFILES = {"BASIC", "BASIC_WL", "EN16931", "EXTENDED"}


PACKS: dict[str, dict] = {
    "pack_20": {"credits": 20, "amount_cents": 900, "name": "Pack 20 crédits"},
    "pack_100": {"credits": 100, "amount_cents": 3500, "name": "Pack 100 crédits"},
    "pack_500": {"credits": 500, "amount_cents": 15000, "name": "Pack 500 crédits"},
}

SUBSCRIPTIONS: dict[str, dict] = {
    "starter": {"credits": 60, "amount_cents": 1900, "name": "Starter"},
    "pro": {"credits": 200, "amount_cents": 4900, "name": "Pro"},
    "business": {"credits": 500, "amount_cents": 9900, "name": "Business"},
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
    if (acct.subscription_status or "").lower() in {"active", "trialing"}:
        plan = f"Abonnement {(acct.subscription_plan or '').capitalize()}"

    return BillingCreditsResponse(
        plan=plan,
        credits_available=available,
        renewal_date=_renewal_date_iso(),
        breakdown=breakdown,
    )


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

        session = stripe.checkout.Session.create(
            mode="payment",
            customer=acct.stripe_customer_id or None,
            customer_creation=None if acct.stripe_customer_id else "always",
            client_reference_id=user.id,
            metadata=metadata,
            line_items=[
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "eur",
                        "unit_amount": int(pack["amount_cents"]),
                        "product_data": {"name": pack["name"]},
                    },
                }
            ],
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return BillingCheckoutResponse(checkout_url=session.url, session_id=session.id)

    if kind == "subscription":
        sub = SUBSCRIPTIONS.get(sku)
        if not sub:
            raise HTTPException(status_code=400, detail="Unknown subscription sku")

        metadata = {
            "kind": "subscription",
            "sku": sku,
            "plan": sku,
            "credits_per_month": str(sub["credits"]),
            "user_id": user.id,
        }

        session = stripe.checkout.Session.create(
            mode="subscription",
            customer=acct.stripe_customer_id or None,
            customer_creation=None if acct.stripe_customer_id else "always",
            client_reference_id=user.id,
            metadata=metadata,
            subscription_data={"metadata": metadata},
            line_items=[
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "eur",
                        "unit_amount": int(sub["amount_cents"]),
                        "recurring": {"interval": "month"},
                        "product_data": {"name": f"Abonnement {sub['name']}"},
                    },
                }
            ],
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return BillingCheckoutResponse(checkout_url=session.url, session_id=session.id)

    raise HTTPException(status_code=400, detail="Invalid kind")


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

    def _record(kind: str, credits_delta: int = 0, data: dict | None = None):
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

    if event_type == "checkout.session.completed":
        if not user_id:
            _record("unknown", data={"event_type": event_type})
            db.commit()
            return {"ok": True}

        acct = _ensure_billing_account(db, user_id)
        _sync_credits_periods(acct)

        customer_id = obj.get("customer")
        if customer_id and not acct.stripe_customer_id:
            acct.stripe_customer_id = customer_id

        kind = (metadata.get("kind") or "").lower()
        if kind == "pack":
            credits = int(metadata.get("credits") or 0)
            acct.paid_credits = int(acct.paid_credits or 0) + credits
            _record(
                kind="pack_credit",
                credits_delta=credits,
                data={"sku": metadata.get("sku"), "customer": customer_id},
            )
            db.commit()
            return {"ok": True}

        if kind == "subscription":
            acct.stripe_subscription_id = obj.get("subscription") or acct.stripe_subscription_id
            acct.subscription_plan = metadata.get("plan") or metadata.get("sku")
            acct.subscription_status = "active"
            acct.sub_quota = int(metadata.get("credits_per_month") or 0)
            acct.sub_period = _current_period()
            acct.sub_used = 0
            _record(
                kind="subscription_credit",
                credits_delta=0,
                data={
                    "plan": acct.subscription_plan,
                    "subscription": acct.stripe_subscription_id,
                    "customer": customer_id,
                },
            )
            db.commit()
            return {"ok": True}

        _record("unknown", data={"event_type": event_type})
        db.commit()
        return {"ok": True}

    if event_type in {"customer.subscription.updated", "customer.subscription.deleted"}:
        if not user_id:
            _record("subscription_update_missing_user", data={"event_type": event_type})
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
        _record(
            kind="subscription_status",
            credits_delta=0,
            data={"status": status, "subscription": sub_id, "event_type": event_type},
        )
        db.commit()
        return {"ok": True}

    _record("ignored", data={"event_type": event_type})
    db.commit()
    return {"ok": True}
