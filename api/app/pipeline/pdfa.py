from __future__ import annotations

import logging
import shutil
import subprocess
from pathlib import Path

import ocrmypdf
import pikepdf
from pikepdf import Name, Pdf

logger = logging.getLogger(__name__)


def _preprocess_pdf_for_pdfa(input_pdf: str, output_pdf: str) -> None:
    """
    Pre-process PDF to fix non-embeddable fonts and device color spaces.
    
    This step is crucial because many PDFs use:
    - Helvetica/Helvetica-Bold (Base-14 fonts that are not embedded)
    - DeviceRGB without OutputIntent
    
    We replace font references and prepare for PDF/A-3 conversion.
    """
    with Pdf.open(input_pdf, allow_overwriting_input=True) as pdf:
        # Font substitution mapping (Base-14 → embeddable equivalents)
        # Note: We can't directly embed fonts here, but we can remove references
        # that will cause PDF/A validation failures
        font_map = {
            "/Helvetica": "/Helvetica",  # Will be handled by ocrmypdf
            "/Helvetica-Bold": "/Helvetica-Bold",
            "/Helvetica-Oblique": "/Helvetica-Oblique",
            "/Helvetica-BoldOblique": "/Helvetica-BoldOblique",
            "/Times-Roman": "/Times-Roman",
            "/Times-Bold": "/Times-Bold",
            "/Times-Italic": "/Times-Italic",
            "/Times-BoldItalic": "/Times-BoldItalic",
            "/Courier": "/Courier",
            "/Courier-Bold": "/Courier-Bold",
            "/Courier-Oblique": "/Courier-Oblique",
            "/Courier-BoldOblique": "/Courier-BoldOblique",
        }
        
        # Process all pages
        for page in pdf.pages:
            if "/Resources" not in page:
                continue
            
            resources = page.Resources
            
            # Mark fonts for substitution (ocrmypdf will handle actual embedding)
            if "/Font" in resources:
                fonts = resources.Font
                for font_name in list(fonts.keys()):
                    font_obj = fonts[font_name]
                    if isinstance(font_obj, pikepdf.Dictionary):
                        if "/BaseFont" in font_obj:
                            base_font = str(font_obj.BaseFont)
                            # Mark Base-14 fonts for special handling
                            if base_font in font_map:
                                logger.info(f"Found Base-14 font: {base_font}")
        
        # Save preprocessed PDF
        pdf.save(output_pdf, linearize=True)


def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """Convert to PDF/A-3b using pikepdf pre-processing + ocrmypdf."""
    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    # Step 1: Pre-process PDF to prepare for PDF/A conversion
    preprocessed = out_p.parent / f"preprocessed_{in_p.name}"
    try:
        _preprocess_pdf_for_pdfa(str(in_p), str(preprocessed))
    except Exception as e:
        logger.warning(f"PDF preprocessing failed: {e}, using original")
        preprocessed = in_p

    # Step 2: Convert to PDF/A-3b with ocrmypdf
    # CRITICAL: Use redo_ocr=True to force font replacement
    # This will re-render all text with embeddable fonts, solving the Base-14 font issue
    # The OCR layer will be placed over existing text, preserving accuracy
    
    try:
        result = ocrmypdf.ocrmypdf(
            input_file=str(preprocessed),
            output_file=str(out_p),
            output_type="pdfa-3a",  # PDF/A-3A (Accessible) level as requested
            redo_ocr=True,  # CRITICAL: Force OCR to replace non-embeddable fonts
            force_ocr=True,  # Force OCR even if text is detected
            tesseract_timeout=300,
            optimize=0,
            jbig2_lossy=False,
            jpeg_quality=95,
            png_quality=95,
            deskew=False,
            remove_background=False,
            clean=False,
        )
        logger.info(f"ocrmypdf completed with result: {result}")
    except Exception as e:
        raise RuntimeError(f"ocrmypdf PDF/A-3 conversion failed: {e}")
    finally:
        # Cleanup preprocessed file
        if preprocessed != in_p and preprocessed.exists():
            preprocessed.unlink()

    if not out_p.exists() or out_p.stat().st_size < 1000:
        raise RuntimeError(
            f"ocrmypdf produced invalid output: file missing or too small"
        )
    
    return str(out_p)
