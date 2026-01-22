from __future__ import annotations

import logging
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)


def ensure_pdfa3(input_pdf: str, output_pdf: str) -> str:
    """
    Convert to PDF/A-3b using ocrmypdf CLI with aggressive font replacement.
    
    Strategy:
    1. Force OCR on ALL text to replace Base-14 fonts (Helvetica, etc.)
    2. ocrmypdf will embed Tesseract's fonts and add OutputIntent
    3. This sacrifices exact text preservation for PDF/A compliance
    """
    in_p = Path(input_pdf)
    out_p = Path(output_pdf)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    # Build ocrmypdf command with all options
    # Note: Boolean flags are either present (True) or absent (False)
    cmd = [
        "ocrmypdf",
        "--output-type", "pdfa-3",  # PDF/A-3B (Basic conformance)
        "--redo-ocr",  # CRITICAL: Force OCR to replace ALL text layers
        "--force-ocr",  # Force OCR even if text already exists
        "--invalidate-digital-signatures",  # Allow modification
        "--tesseract-timeout", "300",
        "--optimize", "0",  # No optimization to preserve quality
        "--jpeg-quality", "95",
        "--png-quality", "95",
        "--pdfa-image-compression", "jpeg",
        str(in_p),
        str(out_p),
    ]
    
    try:
        logger.info(f"Running ocrmypdf: {' '.join(cmd)}")
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
            timeout=600,  # 10 minutes max
        )
        logger.info(f"ocrmypdf stdout: {result.stdout}")
        if result.stderr:
            logger.warning(f"ocrmypdf stderr: {result.stderr}")
    except subprocess.CalledProcessError as e:
        logger.error(f"ocrmypdf failed with exit code {e.returncode}")
        logger.error(f"stdout: {e.stdout}")
        logger.error(f"stderr: {e.stderr}")
        raise RuntimeError(f"ocrmypdf PDF/A-3 conversion failed: {e.stderr}")
    except subprocess.TimeoutExpired:
        raise RuntimeError("ocrmypdf timed out after 10 minutes")
    except Exception as e:
        raise RuntimeError(f"ocrmypdf PDF/A-3 conversion failed: {e}")

    if not out_p.exists() or out_p.stat().st_size < 1000:
        raise RuntimeError(
            f"ocrmypdf produced invalid output: file missing or too small"
        )
    
    return str(out_p)
