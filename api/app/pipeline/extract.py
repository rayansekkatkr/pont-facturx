from __future__ import annotations

import re
from datetime import datetime
from typing import Any


def _read_pdf_text(pdf_path: str) -> str:
    """Extract text from PDF (best-effort).

    V1 is intentionally naive: pdfminer text extraction.
    """
    try:
        from pdfminer.high_level import extract_text

        return extract_text(pdf_path) or ""
    except Exception:
        return ""


def _find_first(text: str, pattern: str) -> str | None:
    m = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
    return m.group(1).strip() if m else None


def _parse_amount(raw: str | None) -> float | None:
    if not raw:
        return None
    s = raw.strip()
    # normalize "1 234,56" -> "1234.56"
    s = s.replace(" ", "").replace("\u00a0", "").replace(",", ".")
    s = re.sub(r"[^0-9.\-]", "", s)
    try:
        return float(s)
    except Exception:
        return None


def _parse_date_to_iso(raw: str | None) -> str | None:
    if not raw:
        return None
    s = raw.strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except Exception:
            pass
    # already yyyymmdd
    if len(s) == 8 and s.isdigit():
        try:
            return datetime.strptime(s, "%Y%m%d").strftime("%Y-%m-%d")
        except Exception:
            return None
    return None


def extract_invoice_json(job_id: str, input_pdf_path: str) -> dict[str, Any]:
    """Extract a *minimal* canonical JSON from a 'classic' invoice PDF.

    This is a V1 heuristic extractor. It aims to produce JSON that is:
    - safe to feed to the BASIC_WL XML builder (no missing mandatory date, no None decimals)
    - easy to correct in human-in-the-loop
    """
    text = _read_pdf_text(input_pdf_path)

    invoice_number = _find_first(
        text,
        r"(?:facture|invoice)\s*(?:n[°o]|no|#)?\s*[:\-]?\s*([A-Z0-9\-_/]+)",
    )

    # First date-looking token; refined later
    raw_date = _find_first(text, r"\b(\d{2}[./-]\d{2}[./-]\d{4}|\d{4}[./-]\d{2}[./-]\d{2})\b")
    issue_date = _parse_date_to_iso(raw_date)

    siret = _find_first(text, r"\b(\d{14})\b")

    # IBAN can contain spaces; grab a rough match then clean spaces
    iban_raw = _find_first(text, r"\b([A-Z]{2}\d{2}(?:[ \u00a0]?[A-Z0-9]){10,40})\b")
    iban = re.sub(r"\s|\u00a0", "", iban_raw) if iban_raw else None

    total_ht = _parse_amount(
        _find_first(text, r"(?:total\s*ht|montant\s*ht)\s*[:\-]?\s*([0-9 \u00a0,.]+)")
    )
    total_vat = _parse_amount(
        _find_first(text, r"(?:total\s*tva|montant\s*tva)\s*[:\-]?\s*([0-9 \u00a0,.]+)")
    )
    total_ttc = _parse_amount(
        _find_first(
            text, r"(?:total\s*ttc|montant\s*ttc|net\s*a\s*payer)\s*[:\-]?\s*([0-9 \u00a0,.]+)"
        )
    )

    # VAT rate like "TVA 20%" or "TVA : 20,00 %"
    vat_rate = _parse_amount(
        _find_first(text, r"tva\s*[:\-]?\s*([0-9]{1,2}(?:[\.,][0-9]{1,2})?)\s*%")
    )

    # Safe numeric defaults (avoid None that breaks XSD)
    total_ht = float(total_ht or 0.0)
    total_vat = float(total_vat or 0.0)
    if total_ttc is None:
        total_ttc = total_ht + total_vat
    total_ttc = float(total_ttc)

    # If rate missing but totals suggest one, compute
    if vat_rate is None:
        vat_rate = (total_vat / total_ht * 100.0) if (total_ht > 0 and total_vat > 0) else 0.0

    # Avoid invalid date -> fallback. Keep raw in debug
    issue_date = issue_date or "1970-01-01"

    # Address: keep None by default; BASIC_WL template will skip empty addresses
    empty_addr = {"line1": None, "line2": None, "postcode": None, "city": None, "country": "FR"}

    return {
        "job_id": job_id,
        "invoice_number": invoice_number or "INV-UNKNOWN",
        "issue_date": issue_date,
        "currency": "EUR",
        "seller": {
            "name": "UNKNOWN",
            # kept for later profiles (BASIC/EN16931). BASIC_WL template ignores it.
            "siret": siret,
            "scheme_id": "0002",
            "vat_id": None,
            "address": empty_addr,
        },
        "buyer": {
            "name": "UNKNOWN",
            "siret": None,
            "scheme_id": "0002",
            "vat_id": None,
            "address": empty_addr,
        },
        "totals": {
            "total_ht": total_ht,
            "total_vat": total_vat,
            "total_ttc": total_ttc,
            "vat_rate": vat_rate,
        },
        # kept for later profiles. BASIC_WL template ignores it.
        "iban": iban,
        "bic": None,
        "due_date": None,
        "payment_terms": None,
        "_debug": {
            "text_len": len(text),
            "raw_issue_date": raw_date,
        },
    }
