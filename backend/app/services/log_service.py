from sqlalchemy.orm import Session
from ..models import ActivityLog


def log_action(db: Session, ticket_id, action_text: str):
    """Log an action for a specific ticket"""
    log = ActivityLog(
        ticket_id=ticket_id,
        action=action_text
    )
    db.add(log)
    db.commit()

