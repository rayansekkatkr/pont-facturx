from celery import Celery

from app.config import settings

celery = Celery(
    "pont_facturx",
    broker=settings.redis_url,
    backend=settings.redis_url.replace("/0", "/1"),
)

celery.conf.task_routes = {
    "app.workers.tasks.process_invoice": {"queue": "invoices"},
    "app.workers.tasks.finalize_invoice": {"queue": "invoices"},
}

# IMPORTANT: load tasks
celery.autodiscover_tasks(["app.workers"], force=True)
