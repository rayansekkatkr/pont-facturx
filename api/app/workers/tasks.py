from __future__ import annotations

from pathlib import Path

from sqlalchemy.orm import Session

from app.config import settings
from app.db import SessionLocal
from app.models import InvoiceJob, JobStatus
from app.pipeline.cii_builder import build_cii_xml
from app.pipeline.extract import extract_invoice_json
from app.pipeline.facturx_wrap import wrap_facturx
from app.pipeline.pdfa import ensure_pdfa3
from app.pipeline.validate import validate_bundle
from app.workers.celery_app import celery


def _db() -> Session:
    return SessionLocal()


def _finalize(job: InvoiceJob) -> None:
    """Generate XML, wrap PDF, validate."""
    import logging
    logger = logging.getLogger(__name__)
    
    # 2) Build XML (BASIC WL, MINIMUM, or EN16931)
    job.status = JobStatus.XML_READY
    xml_path = build_cii_xml(job.id, job.profile, job.final_json or {})
    job.output_xml_url = f"file://{xml_path}"

    # 3) (Optional) Convert to PDF/A-3 before embedding
    input_pdf_path = job.input_pdf_url.replace("file://", "")
    pdf_for_wrap = input_pdf_path
    
    # DEBUG: Log configuration status
    logger.warning(f"🔍 PDF/A Conversion Check - Flag: {settings.enable_pdfa_convert}, Type: {type(settings.enable_pdfa_convert)}")
    
    if settings.enable_pdfa_convert:
        logger.warning(f"✅ PDF/A conversion ENABLED - Converting {input_pdf_path}")
        out_dir = Path(settings.storage_local_root) / job.id
        pdfa_path = str(out_dir / "input_pdfa3.pdf")
        pdf_for_wrap = ensure_pdfa3(input_pdf_path, pdfa_path)
        logger.warning(f"✅ PDF/A conversion COMPLETE - Output: {pdf_for_wrap}")
    else:
        logger.warning(f"❌ PDF/A conversion DISABLED - Using original PDF")

    # 4) Wrap into Factur-X PDF (pass profile for correct metadata)
    out_pdf = wrap_facturx(job.id, pdf_for_wrap, xml_path, job.profile)
    job.output_pdf_url = f"file://{out_pdf}"

    # 5) Validate (pass profile to validation for strictness logic)
    validation = validate_bundle(xml_path, out_pdf, job.profile)
    job.validation_json = validation
    job.status = JobStatus.VALIDATED


@celery.task(bind=True)
def process_invoice(self, job_id: str, stop_after_extract: bool = False):
    db = _db()
    try:
        job = db.get(InvoiceJob, job_id)
        if not job:
            return

        # 1) Extract
        extracted = extract_invoice_json(job_id, job.input_pdf_url.replace("file://", ""))
        job.extracted_json = extracted

        # Keep a working copy for human review/edit. Even if the user wants
        # to review, we prefill final_json with the extracted data.
        job.final_json = extracted

        # Review flow: extraction is always a first-class step.
        # The UI will take EXTRACTED -> /confirm -> finalize.
        job.status = JobStatus.EXTRACTED

        if stop_after_extract:
            db.commit()
            return

        _finalize(job)
        db.commit()

    except Exception as e:
        job = db.get(InvoiceJob, job_id)
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            db.commit()
        raise
    finally:
        db.close()


@celery.task(bind=True)
def finalize_invoice(self, job_id: str):
    """Finalize an invoice after the user corrected `final_json` (human-in-the-loop)."""
    db = _db()
    try:
        job = db.get(InvoiceJob, job_id)
        if not job:
            return
        if not job.final_json:
            raise RuntimeError("final_json is empty; cannot finalize")
        # ✅ Idempotence: si déjà validé, ne rien faire
        if job.status == JobStatus.VALIDATED:
            return

        # ✅ on finalise seulement si XML_READY (après confirm)
        if job.status != JobStatus.XML_READY:
            return
        _finalize(job)
        db.commit()
    except Exception as e:
        job = db.get(InvoiceJob, job_id)
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            db.commit()
        raise
    finally:
        db.close()
