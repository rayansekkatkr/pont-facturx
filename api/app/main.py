import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.routes.invoices import router as invoices_router
from app.config import settings
from app.db import Base, engine

app = FastAPI(title="Pont Factur-X V1", version="0.1.0")

app.include_router(invoices_router, prefix="/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mini UI (single-page) for human review/correction of final_json
# Open: http://localhost:8000/ui (or /ui?job_id=<id>)
app.mount("/ui", StaticFiles(directory="app/static", html=True), name="ui")


def _wait_for_db(*, timeout_seconds: int = 60, interval_seconds: float = 1.0) -> None:
    start = time.monotonic()
    while True:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return
        except OperationalError:
            if (time.monotonic() - start) >= timeout_seconds:
                raise
            time.sleep(interval_seconds)


@app.on_event("startup")
def _startup_db() -> None:
    _wait_for_db(timeout_seconds=60, interval_seconds=1.0)
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"ok": True}
