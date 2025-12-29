from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
from typing import Optional

def _find_srgb_icc() -> Optional[str]:
    # Debian common locations
    candidates = []
    for base in ["/usr/share/color/icc", "/usr/share/color/icc/colord", "/usr/share/color/icc/icc-profiles-free"]:
        p = Path(base)
        if p.exists():
            candidates += [str(x) for x in p.rglob("sRGB*.icc")]
            candidates += [str(x) for x in p.rglob("SRGB*.icc")]
    return candidates[0] if candidates else None

def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """Best-effort conversion to PDF/A-3 using Ghostscript.

    NOTE: PDF/A conversion is notoriously tricky (fonts, colorspaces, transparency).
    This function is **best-effort** and may fail depending on input PDFs.
    """
    gs = shutil.which("gs")
    if not gs:
        raise RuntimeError("ghostscript not found (gs). Install ghostscript or disable ENABLE_PDFA_CONVERT")

    icc = _find_srgb_icc()
    if not icc:
        # Ghostscript can still run, but PDF/A validation may fail due to missing OutputIntent.
        icc = ""

    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        gs,
        "-dPDFA=3",
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        "-dUseCIEColor",
        "-sProcessColorModel=DeviceRGB",
    ]
    if icc:
        cmd += [f"-sOutputICCProfile={icc}"]
    cmd += [f"-sOutputFile={str(out_p)}", str(in_p)]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0 or not out_p.exists() or out_p.stat().st_size < 1000:
        raise RuntimeError(f"Ghostscript PDF/A-3 conversion failed: rc={proc.returncode} stderr={proc.stderr[-500:]}")
    return str(out_p)
