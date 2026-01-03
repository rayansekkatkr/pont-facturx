from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.invoices import router as invoices_router

app = FastAPI(title="Pont Factur-X V1", version="0.1.0")

app.include_router(invoices_router, prefix="/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mini UI (single-page) for human review/correction of final_json
# Open: http://localhost:8000/ui (or /ui?job_id=<id>)
app.mount("/ui", StaticFiles(directory="app/static", html=True), name="ui")


@app.get("/health")
def health():
    return {"ok": True}
