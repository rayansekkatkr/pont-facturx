from __future__ import annotations

from datetime import datetime
from typing import Any


def _to_float(v: Any) -> float | None:
    try:
        if v is None:
            return None
        return float(v)
    except Exception:
        return None


def _parse_date(v: Any) -> bool:
    """Accepte YYYY-MM-DD ou DD/MM/YYYY ou DD-MM-YYYY (souple).
    On valide seulement que c'est une date plausible.
    """
    if not v or not isinstance(v, str):
        return False
    s = v.strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            datetime.strptime(s, fmt)
            return True
        except Exception:
            pass
    return False


def validate_final_json(obj: dict[str, Any]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    seller = obj.get("seller") or {}
    buyer = obj.get("buyer") or {}
    totals = obj.get("totals") or {}

    # required-ish
    inv_no = obj.get("invoice_number")
    if not inv_no:
        errors.append("invoice_number manquant")

    issue_date = obj.get("issue_date")
    if not issue_date:
        errors.append("issue_date manquant")
    elif not _parse_date(issue_date):
        errors.append("issue_date invalide (attendu YYYY-MM-DD ou DD/MM/YYYY)")

    if not (seller.get("name") or "").strip():
        errors.append("seller.name manquant")
    if not (buyer.get("name") or "").strip():
        errors.append("buyer.name manquant")

    # totals
    ht = _to_float(totals.get("total_ht"))
    vat = _to_float(totals.get("total_vat"))
    ttc = _to_float(totals.get("total_ttc"))

    if ht is None:
        errors.append("totals.total_ht doit être un nombre")
    if vat is None:
        errors.append("totals.total_vat doit être un nombre")
    if ttc is None:
        errors.append("totals.total_ttc doit être un nombre")

    # vat_rate: accepte racine OU totals.vat_rate
    vat_rate = obj.get("vat_rate")
    if vat_rate is None:
        vat_rate = totals.get("vat_rate")
        if vat_rate is not None:
            warnings.append(
                "vat_rate est dans totals.vat_rate : recommandé de le mettre à la racine (vat_rate)."
            )

    vat_rate_f = _to_float(vat_rate)
    if vat_rate_f is None:
        errors.append('vat_rate manquant ou invalide (mets "vat_rate": 20.0 à la racine)')

    # coherence totals
    if ht is not None and vat is not None and ttc is not None:
        expected = ht + vat
        if abs(expected - ttc) > 0.05:
            errors.append(f"cohérence: total_ttc ({ttc}) ≠ total_ht+total_vat ({expected})")

    # IBAN quick sanity (warning)
    iban = obj.get("iban")
    if iban:
        s = str(iban).strip()
        if len(s) < 12:
            warnings.append("iban semble trop court")

    return errors, warnings
