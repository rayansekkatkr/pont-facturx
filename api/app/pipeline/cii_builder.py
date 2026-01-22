from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATES_DIR = Path(__file__).resolve().parents[1] / "templates"


def _date_to_102(value: Any) -> str:
    """Return date in UN/CEFACT format 102 (YYYYMMDD).

    NOTE: Factur-X XSD often marks the invoice issue date as mandatory. Returning an
    empty string can make the whole XML invalid. So we use a safe fallback.
    """
    if value is None:
        return "19700101"

    if isinstance(value, (datetime, date)):
        return value.strftime("%Y%m%d")

    s = str(value).strip()
    if not s:
        return "19700101"

    # Accept ISO and common FR formats
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%d-%m-%Y", "%Y%m%d"):
        try:
            dt = datetime.strptime(s, fmt)
            return dt.strftime("%Y%m%d")
        except Exception:
            pass

    # If already looks like 102
    if len(s) == 8 and s.isdigit():
        return s

    # Last resort: safe fallback
    return "19700101"


def _normalize_invoice_for_basic_wl(invoice: dict[str, Any]) -> dict[str, Any]:
    """Normalize/sanitize invoice JSON so the BASIC WL template has predictable inputs.

    This prevents common XSD failures:
    - None used for decimals
    - Missing/invalid dates
    - Empty party names

    We DO NOT try to be semantically perfect here; the goal is a robust V1.
    """
    return _normalize_invoice_base(invoice, include_lines=False)


def _normalize_invoice_for_en16931(invoice: dict[str, Any]) -> dict[str, Any]:
    """Normalize invoice for EN16931/COMFORT profile (with invoice lines)."""
    return _normalize_invoice_base(invoice, include_lines=True)


def _normalize_invoice_base(invoice: dict[str, Any], include_lines: bool = False) -> dict[str, Any]:
    """Base normalization logic for all profiles."""

    inv = dict(invoice or {})
    totals = dict(inv.get("totals") or {})

    def _f(x, default=0.0):
        if x is None:
            return float(default)
        try:
            return float(x)
        except Exception:
            return float(default)

    total_ht = _f(totals.get("total_ht"), 0.0)
    total_vat = _f(totals.get("total_vat"), 0.0)
    total_ttc = totals.get("total_ttc")
    total_ttc = _f(total_ttc, total_ht + total_vat)

    totals["total_ht"] = total_ht
    totals["total_vat"] = total_vat
    totals["total_ttc"] = total_ttc

    # VAT rate: ensure never None
    vat_rate = inv.get("vat_rate")
    if vat_rate is None:
        vat_rate = totals.get("vat_rate")
    if vat_rate is None:
        vat_rate = (total_vat / total_ht * 100.0) if (total_ht > 0 and total_vat > 0) else 0.0
    vat_rate = _f(vat_rate, 0.0)
    inv["vat_rate"] = vat_rate

    # VAT category: S standard, Z zero
    vat_category = inv.get("vat_category")
    if not vat_category:
        vat_category = "Z" if abs(vat_rate) < 1e-9 else "S"
    inv["vat_category"] = vat_category

    # Required-ish fields
    inv["currency"] = inv.get("currency") or "EUR"
    inv["invoice_number"] = inv.get("invoice_number") or inv.get("id") or "INV-UNKNOWN"
    inv["issue_date"] = inv.get("issue_date") or "1970-01-01"

    # Parties
    for key in ("seller", "buyer"):
        party = dict(inv.get(key) or {})
        party["name"] = party.get("name") or "UNKNOWN"

        # BASIC-WL Schematron requires Seller/Buyer postal address (BG-5/BG-8)
        # and country code (BT-40/BT-55). Always emit a PostalTradeAddress once.
        addr = party.get("address")
        if not isinstance(addr, dict):
            addr = {}
        party["address"] = {
            "line1": addr.get("line1"),
            "line2": addr.get("line2"),
            "postcode": addr.get("postcode"),
            "city": addr.get("city"),
            "country": (addr.get("country") or "FR"),
        }
        inv[key] = party

    inv["totals"] = totals

    # Lines: for EN16931/COMFORT profile
    if include_lines:
        lines = inv.get("lines") or []
        if not lines:
            # EN16931 requires at least one line (BR-16)
            # Create a synthetic line from totals if none exist
            lines = [
                {
                    "description": "Prestation",
                    "quantity": 1.0,
                    "unit_price": total_ht,
                    "total": total_ht,
                    "vat_rate": vat_rate,
                    "vat_category": vat_category,
                }
            ]
        # Normalize each line
        normalized_lines = []
        for idx, line in enumerate(lines, 1):
            line_dict = dict(line or {})
            line_dict["line_id"] = line_dict.get("line_id") or str(idx)
            line_dict["description"] = line_dict.get("description") or "Prestation"
            line_dict["quantity"] = _f(line_dict.get("quantity"), 1.0)
            line_dict["unit_price"] = _f(line_dict.get("unit_price"), 0.0)
            line_dict["total"] = _f(line_dict.get("total"), 0.0)
            line_dict["vat_rate"] = _f(line_dict.get("vat_rate"), vat_rate)
            line_dict["vat_category"] = line_dict.get("vat_category") or vat_category
            normalized_lines.append(line_dict)
        inv["lines"] = normalized_lines

    return inv


env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(enabled_extensions=("xml",)),
)
env.filters["date102"] = _date_to_102


def build_cii_xml(job_id: str, profile: str, invoice: dict[str, Any]) -> str:
    """Build a CII XML file for a given Factur-X profile.

    Supports: MINIMUM, BASIC_WL, EN16931
    """
    profile_norm = (profile or "BASIC_WL").strip().upper()

    if profile_norm in ("MINIMUM", "MIN"):
        # MINIMUM uses same structure as BASIC_WL but with minimal data
        inv = _normalize_invoice_for_basic_wl(invoice)
        template = env.get_template("cii_basic_wl.xml.j2")
        xml_str = template.render(invoice=inv)
    elif profile_norm in ("BASIC_WL", "BASICWL", "BASIC-WL"):
        inv = _normalize_invoice_for_basic_wl(invoice)
        template = env.get_template("cii_basic_wl.xml.j2")
        xml_str = template.render(invoice=inv)
    elif profile_norm in ("EN16931", "COMFORT"):
        inv = _normalize_invoice_for_en16931(invoice)
        template = env.get_template("cii_en16931.xml.j2")
        xml_str = template.render(invoice=inv)
    else:
        raise NotImplementedError(f"Profile '{profile}' not implemented. Supported: MINIMUM, BASIC_WL, EN16931.")

    out_dir = Path("/data") / job_id
    out_dir.mkdir(parents=True, exist_ok=True)
    xml_path = out_dir / "factur-x.xml"
    xml_path.write_text(xml_str, encoding="utf-8")
    return str(xml_path)


# Backward-compatible wrapper
def build_cii_basic_wl_xml(job_id: str, invoice: dict[str, Any]) -> str:
    return build_cii_xml(job_id, "BASIC_WL", invoice)
