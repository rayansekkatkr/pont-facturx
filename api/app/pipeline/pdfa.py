from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import ocrmypdf


def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """Convert to PDF/A-3b using ocrmypdf (better PDF/A compliance than raw Ghostscript)."""
    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    # ocrmypdf with --output-type pdfa-3 handles:
    # - Proper OutputIntent with ICC profile
    # - Font embedding (converts Base-14 to embeddable equivalents)
    # - Color space conversion (DeviceRGB -> ICC-based)
    # - PDF/A-3b compliance validation
    
    try:
        ocrmypdf.ocrmypdf(
            input_file=str(in_p),
            output_file=str(out_p),
            output_type="pdfa-3",
            skip_text=True,  # Don't OCR (preserve original text)
            fast_web_view=0,  # Disable fast web view optimization
            optimize=0,  # No image optimization
            jbig2_lossy=False,
            png_quality=100,
            jpeg_quality=100,
            invalidate_digital_signatures=True,  # Required for PDF/A conversion
            force_ocr=False,  # Don't force OCR on existing text
            redo_ocr=False,
            quiet=True,
        )
    except Exception as e:
        raise RuntimeError(f"ocrmypdf PDF/A-3 conversion failed: {e}")

    if not out_p.exists() or out_p.stat().st_size < 1000:
        raise RuntimeError(
            f"ocrmypdf produced invalid output: file missing or too small"
        )
    
    return str(out_p)
