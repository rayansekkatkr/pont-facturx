import enum
import uuid

from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, Integer, String, Text, func

from app.db import Base


class JobStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    EXTRACTED = "EXTRACTED"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    XML_READY = "XML_READY"
    WRAPPED = "WRAPPED"
    VALIDATED = "VALIDATED"
    FAILED = "FAILED"


class InvoiceJob(Base):
    __tablename__ = "invoice_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.UPLOADED)
    profile = Column(String, nullable=False, default="BASIC_WL")

    input_pdf_url = Column(String, nullable=False)
    output_pdf_url = Column(String, nullable=True)
    output_xml_url = Column(String, nullable=True)

    extracted_json = Column(JSON, nullable=True)
    final_json = Column(JSON, nullable=True)
    validation_json = Column(JSON, nullable=True)

    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    EXTRACTED = "EXTRACTED"
    XML_READY = "XML_READY"
    VALIDATED = "VALIDATED"
    FAILED = "FAILED"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)  # uuid string
    email = Column(String, nullable=False, unique=True, index=True)

    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    company = Column(String, nullable=True)

    hashed_password = Column(String, nullable=True)  # null si compte google-only
    google_sub = Column(String, nullable=True, unique=True, index=True)  # subject Google

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False
    )


class BillingAccount(Base):
    __tablename__ = "billing_accounts"

    # 1:1 with User, but separate table to avoid altering the existing users schema.
    user_id = Column(String, primary_key=True)

    stripe_customer_id = Column(String, nullable=True, unique=True, index=True)
    stripe_subscription_id = Column(String, nullable=True, unique=True, index=True)
    subscription_plan = Column(String, nullable=True)  # starter | pro | business
    subscription_status = Column(String, nullable=True)  # active | past_due | canceled | ...

    # Paid credit packs (never expire unless you want them to)
    paid_credits = Column(Integer, nullable=False, default=0)

    # Subscription monthly quota tracking
    sub_period = Column(String, nullable=True)  # YYYY-MM
    sub_quota = Column(Integer, nullable=False, default=0)
    sub_used = Column(Integer, nullable=False, default=0)

    # Free plan monthly quota tracking
    free_period = Column(String, nullable=True)  # YYYY-MM
    free_quota = Column(Integer, nullable=False, default=3)
    free_used = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False
    )


class BillingEvent(Base):
    __tablename__ = "billing_events"

    # Stripe retries webhook deliveries; use the event id for idempotency.
    stripe_event_id = Column(String, primary_key=True)
    user_id = Column(String, nullable=True, index=True)
    kind = Column(String, nullable=False)  # pack_credit | subscription_credit | consume
    credits_delta = Column(Integer, nullable=False, default=0)
    data = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ConversionRecord(Base):
    __tablename__ = "conversion_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    file_name = Column(String, nullable=False)
    invoice_number = Column(String, nullable=True)
    client_name = Column(String, nullable=True)
    amount_total = Column(String, nullable=True)
    currency = Column(String, nullable=True)
    profile = Column(String, nullable=False, default="BASIC_WL")
    status = Column(String, nullable=False, default="ready")
    pdf_path = Column(String, nullable=False)
    xml_path = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)

