import enum
import uuid
from sqlalchemy import Column, String, DateTime, Enum, JSON, Text, func
from sqlalchemy.sql import func
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

class JobStatus(str, Enum):
    UPLOADED = "UPLOADED"
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
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False)
