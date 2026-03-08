from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import User
from .password import hash_password


def seed_admin_if_empty():
    """Create default admin user (username: admin, password: admin123) if no users exist."""
    db = SessionLocal()
    try:
        if db.query(User).first() is not None:
            return
        admin = User(
            username="admin",
            password_hash=hash_password("admin123"),
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()
