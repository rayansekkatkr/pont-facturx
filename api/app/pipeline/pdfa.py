from __future__ import annotations

import logging
from pathlib import Path

import ocrmypdf

logger = logging.getLogger(__name__)


def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """
    Convert to PDF/A-3b using ocrmypdf with aggressive font replacement.
    
    Strategy:
    1. Force OCR on ALL text to replace Base-14 fonts (Helvetica, etc.)
    2. ocrmypdf will embed Tesseract's fonts and add OutputIntent
    3. This sacrifices exact text preservation for PDF/A compliance
    """
    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    try:
        result = ocrmypdf.ocrmypdf(
            input_file=str(in_p),
            output_file=str(out_p),
            output_type="pdfa-3",  # PDF/A-3B (Basic conformance)
            redo_ocr=True,  # CRITICAL: Force OCR to replace ALL text layers
            force_ocr=True,  # Force OCR even if text already exists
            skip_text=False,  # Replace existing text (required for font embedding)
            invalidate_digital_signatures=True,  # Allow modification
            tesseract_timeout=300,
            optimize=0,  # No optimization to preserve quality
            jbig2_lossy=False,
            jpeg_quality=95,
            png_quality=95,
            deskew=False,
            remove_background=False,
            clean=False,
            pdfa_image_compression="jpeg",
        )
        logger.info(f"ocrmypdf completed with result: {result}")
    except Exception as e:
        raise RuntimeError(f"ocrmypdf PDF/A-3 conversion failed: {e}")

    if not out_p.exists() or out_p.stat().st_size < 1000:
        raise RuntimeError(
            f"ocrmypdf produced invalid output: file missing or too small"
        )
    
    return str(out_p)
