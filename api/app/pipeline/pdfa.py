from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def _find_srgb_icc() -> str | None:
    # Debian common locations
    candidates = []
    for base in [
        "/usr/share/color/icc",
        "/usr/share/color/icc/colord",
        "/usr/share/color/icc/icc-profiles-free",
    ]:
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
        raise RuntimeError(
            "ghostscript not found (gs). Install ghostscript or disable ENABLE_PDFA_CONVERT"
        )

    icc = _find_srgb_icc()
    if not icc:
        # Ghostscript can still run, but PDF/A validation may fail due to missing OutputIntent.
        icc = ""

    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    # Ghostscript runs in SAFER mode by default on modern versions, which may deny reading
    # ICC profiles from system locations. Copy the ICC next to the output file and reference
    # the local path to avoid permission issues.
    if icc:
        try:
            icc_src = Path(icc)
            icc_local = out_p.parent / icc_src.name
            icc_local.write_bytes(icc_src.read_bytes())
            icc = str(icc_local)
        except Exception:
            # If we cannot copy the ICC, continue without rewriting; Ghostscript may still work.
            pass

    cmd = [
        gs,
        "-dNOSAFER",
        "-dPDFA=3",
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
    ]
    if icc:
        cmd += [f"-sOutputICCProfile={icc}"]
    cmd += [f"-sOutputFile={str(out_p)}", str(in_p)]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0 or not out_p.exists() or out_p.stat().st_size < 1000:
        stderr_tail = (proc.stderr or "")[-4000:]
        stdout_tail = (proc.stdout or "")[-4000:]
        raise RuntimeError(
            "Ghostscript PDF/A-3 conversion failed: "
            f"rc={proc.returncode} cmd={' '.join(cmd)} stdout={stdout_tail} stderr={stderr_tail}"
        )
    return str(out_p)
