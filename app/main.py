from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .database import Base, engine
from . import models
from .routers import tickets


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SupportDesk CRM",
    description="Customer Support Ticket Management API",
    version="1.0.0"
)


BASE_DIR = Path(__file__).resolve().parent

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)

templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)


app.include_router(tickets.router)


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"request": request}
    )

@app.get("/create-ticket", response_class=HTMLResponse)
def create_ticket_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="create-ticket.html",
        context={"request": request}
    )

@app.get("/ticket/{ticket_id}", response_class=HTMLResponse)
def ticket_detail_page(
    request: Request,
    ticket_id: str
):
    return templates.TemplateResponse(
        request=request,
        name="ticket-detail.html",
        context={
            "request": request,
            "ticket_id": ticket_id
        }
    )