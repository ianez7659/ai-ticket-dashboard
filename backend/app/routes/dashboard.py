from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Ticket

router = APIRouter()


@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    tickets = db.query(Ticket).all()

    total = len(tickets)
    open_count = len([t for t in tickets if t.status == "OPEN"])
    progress = len([t for t in tickets if t.status == "IN_PROGRESS"])
    done = len([t for t in tickets if t.status == "DONE"])

    return {
        "total": total or 0,
        "open": open_count or 0,
        "in_progress": progress or 0,
        "done": done or 0
    }

