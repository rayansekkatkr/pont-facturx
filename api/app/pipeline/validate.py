from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
from typing import Dict, Any

from app.config import settings
from app.pipeline.schematron import run_en16931_cii_schematron

def validate_xml_xsd(xml_path: str) -> Dict[str, Any]:
    """Validate XML against official Factur-X XSD using factur-x CLI (facturx-xmlcheck).

    The factur-x project ships a CLI to check XML against the official XSD.
    """
    bin_path = shutil.which("facturx-xmlcheck")
    if not bin_path:
        return {
            "status": "skipped",
            "reason": "missing_facturx_cli",
            "hint": "Ensure factur-x is installed in the worker image",
        }

    proc = subprocess.run([bin_path, xml_path], capture_output=True, text=True)
    ok = proc.returncode == 0
    return {
        "status": "ok" if ok else "failed",
        "returncode": proc.returncode,
        "stdout_tail": (proc.stdout or "")[-2000:],
        "stderr_tail": (proc.stderr or "")[-2000:],
    }

def validate_xml_schematron(xml_path: str) -> Dict[str, Any]:
    if not settings.enable_schematron:
        return {"status": "skipped", "reason": "disabled"}
    return run_en16931_cii_schematron(xml_path, settings.en16931_validators_root)

def validate_pdfa_verapdf(pdf_path: str) -> Dict[str, Any]:
    if not settings.enable_verapdf:
        return {"status": "skipped", "reason": "disabled"}
    bin_path = shutil.which("verapdf")
    if not bin_path:
        return {"status": "skipped", "reason": "missing_verapdf"}

    # Try JSON output first; fall back to default if the option is unsupported.
    for args in ([bin_path, "--format", "json", pdf_path], [bin_path, pdf_path]):
        proc = subprocess.run(args, capture_output=True, text=True)
        if proc.returncode in (0, 1):  # 1 often means "not compliant"
            return {
                "status": "ok" if proc.returncode == 0 else "failed",
                "returncode": proc.returncode,
                "stdout_tail": (proc.stdout or "")[-4000:],
                "stderr_tail": (proc.stderr or "")[-2000:],
                "cmd": " ".join(args),
            }
    return {"status": "error", "reason": "verapdf_invocation_failed"}

def validate_bundle(xml_path: str, pdf_path: str) -> Dict[str, Any]:
    # Basic existence checks
    p = Path(pdf_path)
    if not p.exists() or p.stat().st_size < 1000:
        raise RuntimeError("PDF output missing or too small")

    return {
        "xml_xsd": validate_xml_xsd(xml_path),
        "xml_schematron": validate_xml_schematron(xml_path),
        "pdf_verapdf": validate_pdfa_verapdf(pdf_path),
    }
