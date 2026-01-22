import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.routes.invoices import router as invoices_router
from app.config import settings
from app.db import Base, engine

# Rate limiting configuration
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(title="Pont Factur-X V1", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(invoices_router, prefix="/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
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
@limiter.limit("60/minute")
async def health(request: Request):
    return {"ok": True}
