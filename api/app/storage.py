from pathlib import Path

from app.config import settings


def job_dir(job_id: str) -> Path:
    root = Path(settings.storage_local_root)
    p = root / job_id
    p.mkdir(parents=True, exist_ok=True)
    return p


def save_input_pdf(job_id: str, filename: str, content: bytes) -> str:
    d = job_dir(job_id)
    path = d / "input.pdf"
    path.write_bytes(content)
    return str(path)


def path_to_url(path: str) -> str:
    # For V1 local dev, "url" is just a filesystem path.
    return path
