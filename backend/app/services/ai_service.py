from sqlalchemy.orm import Session
from ..models import Ticket
from ..config.openai_client import client
from .log_service import log_action
import uuid


def summarize_ticket(ticket_id: str, db: Session) -> dict:
    """Generate AI summary for a ticket"""
    ticket = db.query(Ticket).filter(Ticket.id == uuid.UUID(ticket_id)).first()

    if not ticket:
        return {"error": "not found"}

    text = f"""
    Summarize this support ticket in clean markdown format:

    {ticket.name}
    {ticket.email}
    {ticket.title}
    {ticket.description}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": text}],
    )

    summary = response.choices[0].message.content
    log_action(db, ticket.id, "AI summary generated")

    return {"summary": summary}


def generate_reply(ticket_id: str, db: Session) -> dict:
    """Generate AI reply for a ticket"""
    ticket = db.query(Ticket).filter(Ticket.id == uuid.UUID(ticket_id)).first()

    if not ticket:
        return {"error": "not found"}

    prompt = f"""
    You are a helpful customer support agent.

    A user submitted this support request:
    {ticket.name}
    {ticket.email}
    {ticket.title}
    {ticket.description}

    Write a professional, helpful reply to the customer.
    Write reply in clean markdown format.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    reply = response.choices[0].message.content
    log_action(db, ticket.id, "AI reply generated")

    return {"reply": reply}

