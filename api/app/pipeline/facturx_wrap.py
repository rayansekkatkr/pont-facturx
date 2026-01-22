from pathlib import Path


def wrap_facturx(job_id: str, input_pdf_path: str, xml_path: str, profile: str = "basic") -> str:
    """Create a Factur-X PDF from input PDF + XML.

    This uses the `factur-x` Python library.
    Args:
        job_id: Unique job identifier
        input_pdf_path: Path to input PDF (should be PDF/A-3 compliant)
        xml_path: Path to Factur-X XML file
        profile: Factur-X profile level (minimum, basic, basicwl, en16931, comfort, extended)
    
    Returns:
        Path to output Factur-X PDF
    """
    out_dir = Path("/data") / job_id
    out_dir.mkdir(parents=True, exist_ok=True)
    output_pdf = out_dir / "output_facturx.pdf"

    # Map profile names to factur-x library conventions
    # BASIC_WL -> basic-wl, EN16931 -> en16931, MINIMUM -> minimum
    profile_map = {
        "MINIMUM": "minimum",
        "BASIC_WL": "basic-wl",
        "BASICWL": "basic-wl",
        "BASIC-WL": "basic-wl",
        "EN16931": "en16931",
        "COMFORT": "comfort",
        "EXTENDED": "extended",
    }
    profile_norm = profile.strip().upper()
    facturx_level = profile_map.get(profile_norm, "basic-wl")

    try:
        from facturx import generate_facturx_from_file

        generate_facturx_from_file(
            input_pdf_path, 
            xml_path, 
            facturx_level=facturx_level,
            output_pdf_file=str(output_pdf)
        )
    except Exception as e:
        raise RuntimeError(f"factur-x wrap failed for profile {facturx_level}: {e}")

    return str(output_pdf)
