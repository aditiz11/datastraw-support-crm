from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Ticket, Note
from ..schemas import (
    TicketCreate,
    TicketListResponse,
    TicketDetailResponse,
    TicketUpdate
)

router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)


@router.post("/")
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db)
):
    last_ticket = (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .first()
    )

    if last_ticket:
        next_number = last_ticket.id + 1
    else:
        next_number = 1

    ticket_id = f"TKT-{next_number:03d}"

    ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=ticket_data.customer_name,
        customer_email=ticket_data.customer_email,
        subject=ticket_data.subject,
        description=ticket_data.description,
        status="Open",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "ticket_id": ticket.ticket_id,
        "created_at": ticket.created_at
    }


@router.get("/", response_model=list[TicketListResponse])
def get_tickets(
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)

    # Filter by status
    if status:
        query = query.filter(Ticket.status == status)

    # Search across multiple fields
    if search:
        search_term = f"%{search}%"

        query = query.filter(
            or_(
                Ticket.ticket_id.ilike(search_term),
                Ticket.customer_name.ilike(search_term),
                Ticket.customer_email.ilike(search_term),
                Ticket.subject.ilike(search_term),
                Ticket.description.ilike(search_term)
            )
        )

    tickets = (
        query
        .order_by(Ticket.created_at.desc())
        .all()
    )

    return tickets

@router.get("/{ticket_id}", response_model=TicketDetailResponse)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db)
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.ticket_id == ticket_id)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket {ticket_id} not found"
        )

    return ticket

@router.put("/{ticket_id}")
def update_ticket(
    ticket_id: str,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.ticket_id == ticket_id)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket {ticket_id} not found"
        )

    # Update status if provided
    if ticket_data.status is not None:
        allowed_statuses = {
            "Open",
            "In Progress",
            "Closed"
        }

        if ticket_data.status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail="Invalid status. Use Open, In Progress, or Closed."
            )

        ticket.status = ticket_data.status

    if ticket_data.priority is not None:

        allowed_priorities = {
            "Low",
            "Medium",
            "High"
        }

        if ticket_data.priority not in allowed_priorities:

            raise HTTPException(
                status_code=400,
                detail="Invalid priority. Use Low, Medium, or High."
            )

        ticket.priority = ticket_data.priority
    
    # Add note if provided
    if ticket_data.notes is not None:
        note = Note(
            ticket_id=ticket.id,
            note_text=ticket_data.notes
        )

        db.add(note)

    ticket.updated_at = datetime.now(timezone.utc)

    db.commit()

    return {
        "success": True,
        "updated_at": ticket.updated_at
    }