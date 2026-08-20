from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class TicketCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    customer_email: EmailStr
    subject: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5)


class NoteResponse(BaseModel):
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True


class TicketListResponse(BaseModel):

    ticket_id: str
    customer_name: str
    subject: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True


class TicketDetailResponse(BaseModel):

    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    notes: list[NoteResponse]

    class Config:
        from_attributes = True

class TicketUpdate(BaseModel):

    status: str | None = None
    priority: str | None = None
    notes: str | None = None