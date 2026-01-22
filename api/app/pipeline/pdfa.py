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


def _ps_escape_string(value: str) -> str:
    # Escape a Python string for PostScript literal string syntax: ( ... ).
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


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

    # Create a minimal PDF/A prefix that sets an OutputIntent using our ICC path.
    # Ghostscript's bundled PDFA_def.ps defaults to (srgb.icc) in the current dir.
    pdfa_prefix_ps: str | None = None
    if icc:
        icc_ps = _ps_escape_string(icc)
        prefix_path = out_p.parent / "PDFA_def_local.ps"
        prefix_path.write_text(
            "\n".join(
                [
                    "%!PS",
                    "% Minimal PDF/A prefix that sets an RGB OutputIntent.",
                    "/ICCProfile (" + icc_ps + ") def",
                    "[/_objdef {icc_PDFA} /type /stream /OBJ pdfmark",
                    "[{icc_PDFA} << /N 3 >> /PUT pdfmark",
                    "[",
                    "{icc_PDFA}",
                    "{ICCProfile (r) file} stopped",
                    "{",
                    "  (\\n\\tFailed to open the supplied ICCProfile for reading. This may be due to\\n) print",
                    "  (\\t  an incorrect filename or a failure to add --permit-file-read=<profile>\\n) print",
                    "  (\\t  to the command line. This PostScript program needs to open the file\\n) print",
                    "  (\\t  and you must explicitly grant it permission to do so.\\n\\n) print",
                    "  (\\tPDF/A processing aborted, output may not be a PDF/A file.\\n\\n) print",
                    "  cleartomark",
                    "}",
                    "{",
                    "  /PUT pdfmark",
                    "  [/_objdef {OutputIntent_PDFA} /type /dict /OBJ pdfmark",
                    "  [{OutputIntent_PDFA} <<",
                    "    /Type /OutputIntent",
                    "    /S /GTS_PDFA1",
                    "    /DestOutputProfile {icc_PDFA}",
                    "    /OutputConditionIdentifier (sRGB)",
                    "  >> /PUT pdfmark",
                    "  [{Catalog} <</OutputIntents [ {OutputIntent_PDFA} ]>> /PUT pdfmark",
                    "} ifelse",
                ]
            ),
            encoding="utf-8",
        )
        pdfa_prefix_ps = str(prefix_path)

    cmd = [
        gs,
        "-dPDFA=3",
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        "-dEmbedAllFonts=true",
        "-dSubsetFonts=true",
        "-dCompressFonts=true",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-sColorConversionStrategyForImages=RGB",
    ]
    if icc:
        # The prefix PS opens the ICC profile; allow it under SAFER.
        cmd += [f"--permit-file-read={icc}"]
    # pdfwrite requires the output file to be set before processing any input.
    cmd += [f"-sOutputFile={str(out_p)}"]

    if pdfa_prefix_ps:
        cmd += [pdfa_prefix_ps]
    cmd += [str(in_p)]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0 or not out_p.exists() or out_p.stat().st_size < 1000:
        stderr_tail = (proc.stderr or "")[-4000:]
        stdout_tail = (proc.stdout or "")[-4000:]
        raise RuntimeError(
            "Ghostscript PDF/A-3 conversion failed: "
            f"rc={proc.returncode} cmd={' '.join(cmd)} stdout={stdout_tail} stderr={stderr_tail}"
        )
    return str(out_p)
