from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from .db import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"))
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
