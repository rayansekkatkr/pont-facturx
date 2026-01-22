from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def _find_srgb_icc() -> str | None:
    # Debian/Ubuntu common locations
    candidates = []
    for base in [
        "/usr/share/color/icc",
        "/usr/share/color/icc/colord",
        "/usr/share/color/icc/icc-profiles-free",
        "/System/Library/ColorSync/Profiles",  # macOS
        "/Library/ColorSync/Profiles",  # macOS
    ]:
        p = Path(base)
        if p.exists():
            candidates += [str(x) for x in p.rglob("sRGB*.icc")]
            candidates += [str(x) for x in p.rglob("SRGB*.icc")]
            candidates += [str(x) for x in p.rglob("*RGB*.icc")]
    
    # Prioritize known good profiles
    for candidate in candidates:
        name_lower = Path(candidate).name.lower()
        if "srgb" in name_lower and "v2" in name_lower:
            return candidate
    
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
    
    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    # If no ICC profile found, Ghostscript can use its bundled PDFA_def.ps
    # but we need to ensure the working directory is writable
    pdfa_prefix_ps: str | None = None
    
    if not icc:
        # Use Ghostscript's bundled PDFA definition
        # Create a minimal PDFA definition that uses Ghostscript's built-in sRGB
        print("[PDF/A] Warning: No system sRGB ICC profile found, using Ghostscript defaults")
        prefix_path = out_p.parent / "PDFA_def_minimal.ps"
        prefix_path.write_text(
            "\n".join(
                [
                    "%!PS",
                    "% Minimal PDF/A-3 definition using Ghostscript built-in profiles",
                    "% This ensures proper OutputIntent and DefaultRGB setup",
                    "",
                    "% Use Ghostscript's built-in sRGB profile",
                    "systemdict /PDFX where {",
                    "  pop",
                    "  PDFX /ICCProfile known {",
                    "    PDFX /ICCProfile get",
                    "  } {",
                    "    (srgb.icc)",
                    "  } ifelse",
                    "} {",
                    "  (srgb.icc)",
                    "} ifelse",
                    "/ICCProfile exch def",
                    "",
                    "[/_objdef {icc_PDFA} /type /stream /OBJ pdfmark",
                    "[{icc_PDFA} << /N 3 >> /PUT pdfmark",
                    "[{icc_PDFA} (ICCProfile) (r) file /PUT pdfmark",
                    "",
                    "[/_objdef {OutputIntent_PDFA} /type /dict /OBJ pdfmark",
                    "[{OutputIntent_PDFA} <<",
                    "  /Type /OutputIntent",
                    "  /S /GTS_PDFA1",
                    "  /DestOutputProfile {icc_PDFA}",
                    "  /OutputConditionIdentifier (sRGB IEC61966-2.1)",
                    "  /Info (sRGB IEC61966-2.1)",
                    ">> /PUT pdfmark",
                    "[{Catalog} <</OutputIntents [ {OutputIntent_PDFA} ]>> /PUT pdfmark",
                    "",
                    "% Set DefaultRGB",
                    "[/DefaultRGB {icc_PDFA} /PUT pdfmark",
                ]
            ),
            encoding="utf-8",
        )
        pdfa_prefix_ps = str(prefix_path)
    else:
        # Ghostscript runs in SAFER mode by default on modern versions, which may deny reading
        # ICC profiles from system locations. Copy the ICC next to the output file and reference
        # the local path to avoid permission issues.
        try:
            icc_src = Path(icc)
            icc_local = out_p.parent / icc_src.name
            icc_local.write_bytes(icc_src.read_bytes())
            icc = str(icc_local)
            print(f"[PDF/A] Using ICC profile: {icc}")
        except Exception as e:
            print(f"[PDF/A] Warning: Failed to copy ICC profile: {e}")
            # Continue without custom ICC, use Ghostscript defaults
            icc = None

    # Create a PDF/A definition file only if we have a valid ICC profile
    if icc:
        icc_ps = _ps_escape_string(icc)
        prefix_path = out_p.parent / "PDFA_def_local.ps"
        prefix_path.write_text(
            "\n".join(
                [
                    "%!PS",
                    "% PDF/A-3 OutputIntent with RGB ICC profile",
                    "/ICCProfile (" + icc_ps + ") def",
                    "",
                    "% Load ICC profile",
                    "[/_objdef {icc_PDFA} /type /stream /OBJ pdfmark",
                    "[{icc_PDFA} << /N 3 >> /PUT pdfmark",
                    "[",
                    "{icc_PDFA}",
                    "{ICCProfile (r) file} stopped",
                    "{",
                    "  (\\n\\tFailed to open ICC profile. Continuing without custom profile.\\n) print",
                    "  cleartomark",
                    "}",
                    "{",
                    "  /PUT pdfmark",
                    "  % Create OutputIntent",
                    "  [/_objdef {OutputIntent_PDFA} /type /dict /OBJ pdfmark",
                    "  [{OutputIntent_PDFA} <<",
                    "    /Type /OutputIntent",
                    "    /S /GTS_PDFA1",
                    "    /DestOutputProfile {icc_PDFA}",
                    "    /OutputConditionIdentifier (sRGB IEC61966-2.1)",
                    "    /Info (sRGB IEC61966-2.1)",
                    "  >> /PUT pdfmark",
                    "  [{Catalog} <</OutputIntents [ {OutputIntent_PDFA} ]>> /PUT pdfmark",
                    "  ",
                    "  % Set DefaultRGB to use the ICC profile",
                    "  [/DefaultRGB {icc_PDFA} /PUT pdfmark",
                    "} ifelse",
                ]
            ),
            encoding="utf-8",
        )
        pdfa_prefix_ps = str(prefix_path)
    
    # Create font substitution file to force embedding of base 14 fonts
    font_map_path = out_p.parent / "fontmap_embed"
    font_map_path.write_text(
        "\n".join(
            [
                "% Force embedding of standard fonts by mapping to URW equivalents",
                "/Courier /NimbusMonoPS-Regular ;",
                "/Courier-Bold /NimbusMonoPS-Bold ;",
                "/Courier-Oblique /NimbusMonoPS-Italic ;",
                "/Courier-BoldOblique /NimbusMonoPS-BoldItalic ;",
                "/Helvetica /NimbusSans-Regular ;",
                "/Helvetica-Bold /NimbusSans-Bold ;",
                "/Helvetica-Oblique /NimbusSans-Italic ;",
                "/Helvetica-BoldOblique /NimbusSans-BoldItalic ;",
                "/Times-Roman /NimbusRoman-Regular ;",
                "/Times-Bold /NimbusRoman-Bold ;",
                "/Times-Italic /NimbusRoman-Italic ;",
                "/Times-BoldItalic /NimbusRoman-BoldItalic ;",
                "/Symbol /StandardSymbolsPS ;",
                "/ZapfDingbats /D050000L ;",
            ]
        ),
        encoding="utf-8",
    )

    cmd = [
        gs,
        "-dPDFA=3",
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-dSAFER",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        # Force embedding of all fonts
        "-dEmbedAllFonts=true",
        "-dSubsetFonts=true",
        "-dCompressFonts=true",
        "-dPDFSETTINGS=/prepress",
        # Use custom font map to replace standard fonts with embeddable URW fonts
        f"-sFONTMAP={str(font_map_path)}",
        # Color management for PDF/A-3
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-sColorConversionStrategyForImages=RGB",
        "-dOverrideICC=true",
        # Use CIE color for proper color space handling
        "-dUseCIEColor=true",
        # Additional PDF/A compliance
        "-dNOTRANSPARENCY",
        "-dDetectDuplicateImages=true",
        "-dFastWebView=false",
        # Ensure all resources are properly defined
        "-dAutoRotatePages=/None",
        "-dColorImageDownsampleType=/Bicubic",
        "-dGrayImageDownsampleType=/Bicubic",
    ]
    
    if icc:
        # The prefix PS opens the ICC profile; allow it under SAFER.
        cmd += [f"--permit-file-read={icc}"]
    
    # pdfwrite requires the output file to be set before processing any input.
    cmd += [f"-sOutputFile={str(out_p)}"]

    # Add PDFA definition first if available
    if pdfa_prefix_ps:
        cmd += [pdfa_prefix_ps]
    
    # Then the input PDF
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
