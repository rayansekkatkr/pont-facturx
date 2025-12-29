from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.db import get_db
from app.models import User  # ⚠️ adapte si ton modèle s'appelle autrement
from sqlalchemy.orm import Session

# ✅ Argon2 en premier (recommandé), bcrypt en fallback si tu as d'anciens hashes
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
)

# OAuth2 bearer token (FastAPI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login")

# ✅ soft limit (anti DoS / et évite surprises)
MAX_PASSWORD_BYTES = 1024


def _normalize_password(password: str) -> str:
    if password is None:
        raise ValueError("password is required")
    password = password.strip()
    if len(password) < 8:
        raise ValueError("password must be at least 8 characters")
    if len(password.encode("utf-8")) > MAX_PASSWORD_BYTES:
        raise ValueError(f"password too long (>{MAX_PASSWORD_BYTES} bytes)")
    return password


def hash_password(password: str) -> str:
    password = _normalize_password(password)
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_password = _normalize_password(plain_password)
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str | None = None,
    *,
    sub: str | None = None,
    extra_claims: Optional[Dict[str, Any]] = None,
    expires_minutes: Optional[int] = None,
) -> str:
    """
    Compat: certains endpoints appellent create_access_token(sub=...)
    On supporte subject=... et sub=...
    """
    real_sub = sub or subject
    if not real_sub:
        raise ValueError("create_access_token requires 'subject' or 'sub'")

    if not settings.jwt_secret:
        raise RuntimeError("JWT_SECRET is not configured")

    now = datetime.now(timezone.utc)
    exp_minutes = expires_minutes or getattr(settings, "jwt_access_token_minutes", getattr(settings, "jwt_exp_minutes", 60))

    payload: Dict[str, Any] = {
        "sub": real_sub,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=exp_minutes)).timestamp()),
    }
    if extra_claims:
        payload.update(extra_claims)

    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)



def decode_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing subject")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
