from pathlib import Path


def wrap_facturx(job_id: str, input_pdf_path: str, xml_path: str) -> str:
    """Create a Factur-X PDF from input PDF + XML.

    This uses the `factur-x` Python library.
    In production you should:
    - Ensure PDF/A-3 compliance (possibly convert first)
    - Set profile/version metadata appropriately
    """
    out_dir = Path("/data") / job_id
    out_dir.mkdir(parents=True, exist_ok=True)
    output_pdf = out_dir / "output_facturx.pdf"

    try:
        from facturx import generate_from_file

        generate_from_file(input_pdf_path, xml_path, output_pdf_file=str(output_pdf))
    except Exception as e:
        raise RuntimeError(f"factur-x wrap failed: {e}")

    return str(output_pdf)
