from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def _find_srgb_icc() -> str | None:
    candidates: list[str] = []
    for base in [
        "/usr/share/color/icc",
        "/usr/share/color/icc/colord",
        "/usr/share/color/icc/icc-profiles-free",
    ]:
        p = Path(base)
        if p.exists():
            candidates += [str(x) for x in p.rglob("sRGB*.icc")]
            candidates += [str(x) for x in p.rglob("SRGB*.icc")]

    for candidate in candidates:
        name = Path(candidate).name.lower()
        if "srgb" in name and ("iec" in name or "v2" in name):
            return candidate

    return candidates[0] if candidates else None


def _ps_escape_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """Convert to PDF/A-3b using Ghostscript (strict OutputIntent + embedded fonts)."""
    gs = shutil.which("gs")
    if not gs:
        raise RuntimeError("ghostscript not found (gs)")

    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    icc = _find_srgb_icc()
    if not icc:
        raise RuntimeError(
            "sRGB ICC profile not found. Install icc-profiles-free in the image."
        )

    icc_src = Path(icc)
    icc_local = out_p.parent / icc_src.name
    icc_local.write_bytes(icc_src.read_bytes())
    icc = str(icc_local)

    pdfa_def_path = out_p.parent / "PDFA_def.ps"
    icc_ps = _ps_escape_string(icc)
    pdfa_def_path.write_text(
        "\n".join(
            [
                "%!PS",
                "/ICCProfile (" + icc_ps + ") def",
                "[/_objdef {icc_PDFA} /type /stream /OBJ pdfmark",
                "[{icc_PDFA} << /N 3 >> /PUT pdfmark",
                "[{icc_PDFA} ICCProfile (r) file /PUT pdfmark",
                "[/_objdef {OutputIntent_PDFA} /type /dict /OBJ pdfmark",
                "[{OutputIntent_PDFA} <<",
                "  /Type /OutputIntent",
                "  /S /GTS_PDFA1",
                "  /DestOutputProfile {icc_PDFA}",
                "  /OutputConditionIdentifier (sRGB IEC61966-2.1)",
                "  /Info (sRGB IEC61966-2.1)",
                ">> /PUT pdfmark",
                "[{Catalog} <</OutputIntents [ {OutputIntent_PDFA} ]>> /PUT pdfmark",
                "[/DefaultRGB [/ICCBased {icc_PDFA}] /PUT pdfmark",
            ]
        ),
        encoding="utf-8",
    )

    cmd = [
        gs,
        "-dPDFA=3",
        "-dBATCH",
        "-dNOPAUSE",
        "-dQUIET",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        "-dEmbedAllFonts=true",
        "-dSubsetFonts=true",
        "-dNoOutputFonts",
        "-dPDFSETTINGS=/prepress",
        "-sFONTPATH=/usr/share/fonts/type1/urw-base35:/usr/share/fonts/truetype",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-dUseCIEColor=true",
        "-dNOTRANSPARENCY",
        f"-sOutputFile={str(out_p)}",
        f"--permit-file-read={icc}",
        str(pdfa_def_path),
        str(in_p),
    ]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0 or not out_p.exists() or out_p.stat().st_size < 1000:
        stderr_tail = (proc.stderr or "")[-4000:]
        stdout_tail = (proc.stdout or "")[-4000:]
        raise RuntimeError(
            "Ghostscript PDF/A-3 conversion failed: "
            f"rc={proc.returncode} stdout={stdout_tail} stderr={stderr_tail}"
        )
    return str(out_p)from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def _find_srgb_icc() -> str | None:
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

    for candidate in candidates:
        name_lower = Path(candidate).name.lower()
        if "srgb" in name_lower and "iec" in name_lower:
            return candidate

    return candidates[0] if candidates else None


def _ps_escape_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """Convert to PDF/A-3b using Ghostscript with strict OutputIntent + embedded fonts."""
    gs = shutil.which("gs")
    if not gs:
        raise RuntimeError("ghostscript not found (gs)")

    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    icc = _find_srgb_icc()
    if not icc:
        raise RuntimeError(
            "sRGB ICC profile not found. Install icc-profiles-free in the image."
        )

    icc_src = Path(icc)
    icc_local = out_p.parent / icc_src.name
    icc_local.write_bytes(icc_src.read_bytes())
    icc = str(icc_local)

    pdfa_def_path = out_p.parent / "PDFA_def.ps"
    icc_ps = _ps_escape_string(icc)
    pdfa_def_path.write_text(
        "\n".join(
            [
                "%!PS",
                "/ICCProfile (" + icc_ps + ") def",
                "[/_objdef {icc_PDFA} /type /stream /OBJ pdfmark",
                "[{icc_PDFA} << /N 3 >> /PUT pdfmark",
                "[{icc_PDFA} ICCProfile (r) file /PUT pdfmark",
                "[/_objdef {OutputIntent_PDFA} /type /dict /OBJ pdfmark",
                "[{OutputIntent_PDFA} <<",
                "  /Type /OutputIntent",
                "  /S /GTS_PDFA1",
                "  /DestOutputProfile {icc_PDFA}",
                "  /OutputConditionIdentifier (sRGB IEC61966-2.1)",
                "  /Info (sRGB IEC61966-2.1)",
                ">> /PUT pdfmark",
                "[{Catalog} <</OutputIntents [ {OutputIntent_PDFA} ]>> /PUT pdfmark",
                "[/DefaultRGB [/ICCBased {icc_PDFA}] /PUT pdfmark",
            ]
        ),
        encoding="utf-8",
    )

    cmd = [
        gs,
        "-dPDFA=3",
        "-dBATCH",
        "-dNOPAUSE",
        "-dQUIET",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        "-dEmbedAllFonts=true",
        "-dSubsetFonts=true",
        "-dPDFSETTINGS=/prepress",
        "-sFONTPATH=/usr/share/fonts/type1/urw-base35:/usr/share/fonts/truetype",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-dUseCIEColor=true",
        "-dNOTRANSPARENCY",
        f"-sOutputFile={str(out_p)}",
        f"--permit-file-read={icc}",
        str(pdfa_def_path),
        str(in_p),
    ]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0 or not out_p.exists() or out_p.stat().st_size < 1000:
        stderr_tail = (proc.stderr or "")[-4000:]
        stdout_tail = (proc.stdout or "")[-4000:]
        raise RuntimeError(
            "Ghostscript PDF/A-3 conversion failed: "
            f"rc={proc.returncode} stdout={stdout_tail} stderr={stderr_tail}"
        )
    return str(out_p)
