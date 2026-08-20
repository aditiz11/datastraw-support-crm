# DataStraw Support CRM

A full-stack customer support ticket management system built with **FastAPI, SQLAlchemy, SQLite, HTML, CSS, and JavaScript**.

## Features

* Create support tickets
* View all support tickets
* Search tickets by ticket ID, customer name, email, subject, or description
* Filter tickets by status
* View detailed ticket information
* Update ticket status
* Update ticket priority
* Add internal notes to tickets
* Automatic ticket ID generation
* Automatic creation and update timestamps
* RESTful API with FastAPI
* Interactive API documentation with Swagger UI
* Responsive web interface

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn

### Database

* SQLite

### Frontend

* HTML
* CSS
* JavaScript
* Jinja2 Templates

## Project Structure

```text
datastraw-support-crm/
│
├── app/
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── __init__.py
│   │
│   ├── routers/
│   │   ├── tickets.py
│   │   └── __init__.py
│   │
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   │
│   │   └── js/
│   │       ├── app.js
│   │       ├── create-ticket.js
│   │       └── ticket-detail.js
│   │
│   └── templates/
│       ├── create-ticket.html
│       ├── index.html
│       └── ticket-detail.html
│
├── .gitignore
├── requirements.txt
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aditiz11/datastraw-support-crm.git
cd datastraw-support-crm
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

#### Windows PowerShell

```powershell
venv\Scripts\Activate.ps1
```

#### Windows Command Prompt

```cmd
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload
```

The application will be available at:

```text
http://127.0.0.1:8000
```

## API Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

## API Endpoints

| Method | Endpoint                   | Description                                   |
| ------ | -------------------------- | --------------------------------------------- |
| `POST` | `/api/tickets/`            | Create a new ticket                           |
| `GET`  | `/api/tickets/`            | Get all tickets                               |
| `GET`  | `/api/tickets/{ticket_id}` | Get ticket details                            |
| `PUT`  | `/api/tickets/{ticket_id}` | Update ticket status, priority, or add a note |

## Query Parameters

The ticket listing endpoint supports filtering and searching.

### Filter by Status

```http
GET /api/tickets/?status=Open
```

Supported statuses:

* `Open`
* `In Progress`
* `Closed`

### Search Tickets

```http
GET /api/tickets/?search=Neha
```

Search is supported across:

* Ticket ID
* Customer name
* Customer email
* Subject
* Description

## Example Ticket

```json
{
  "customer_name": "Neha Patel",
  "customer_email": "neha@example.com",
  "subject": "Change email address",
  "description": "I would like to update my registered email address."
}
```

## Ticket Statuses

| Status        | Description                       |
| ------------- | --------------------------------- |
| `Open`        | Newly created ticket              |
| `In Progress` | Ticket is currently being handled |
| `Closed`      | Ticket has been resolved          |

## Ticket Priorities

* `Low`
* `Medium`
* `High`

## Timestamp Handling

Ticket creation and update timestamps are stored using **UTC timestamps** for consistent server-side time handling.

The application displays the appropriate local time in the frontend.

## Core Functionality

### Ticket Creation

Users can create a support ticket by providing:

* Customer name
* Customer email
* Subject
* Description

Each ticket receives an automatically generated ticket ID such as:

```text
TKT-001
TKT-002
TKT-003
```

### Ticket Management

Support staff can:

* View tickets
* Search tickets
* Filter tickets
* Open individual ticket details
* Change ticket status
* Change ticket priority
* Add internal notes

### Ticket Details

Each ticket contains:

* Ticket ID
* Customer information
* Subject
* Description
* Status
* Priority
* Creation timestamp
* Last updated timestamp
* Internal notes

## Architecture

The application follows a simple layered structure:

```text
Browser
   │
   ▼
FastAPI Application
   │
   ├── Routers
   │      │
   │      ▼
   │   Business Logic
   │
   ├── Pydantic Schemas
   │
   └── SQLAlchemy ORM
          │
          ▼
       SQLite Database
```
## Screenshots

### Dashboard

<img width="1920" height="1080" alt="DataStraw Support CRM Dashboard" src="https://github.com/user-attachments/assets/4820fbf4-cad4-4fe0-b944-3e7e73cb3364" />

### Swagger UI — All API Endpoints

<img width="1920" height="1080" alt="Swagger UI showing all API endpoints" src="https://github.com/user-attachments/assets/2f7bad71-457d-443a-984e-414d57fa9dce" />

### Dashboard

<img width="1920" height="1080" alt="DataStraw Support CRM Dashboard" src="https://github.com/user-attachments/assets/4cf72e4e-48b1-4c54-8cba-0301f6056abf" />

### New Ticket Form

<img width="1920" height="1080" alt="New support ticket form" src="https://github.com/user-attachments/assets/66d603b0-5c20-40c0-aa4d-e7578c1944d5" />

### Ticket Details

<img width="1920" height="1080" alt="Support ticket details page" src="https://github.com/user-attachments/assets/e57547cd-a57f-404a-849d-197752b766ed" />

## Technologies Used

| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| Python     | Backend programming language           |
| FastAPI    | REST API and web application framework |
| SQLAlchemy | ORM and database interaction           |
| Pydantic   | Data validation and serialization      |
| SQLite     | Relational database                    |
| Jinja2     | HTML templating                        |
| JavaScript | Frontend interaction                   |
| HTML/CSS   | User interface                         |
| Uvicorn    | ASGI server                            |
| Git/GitHub | Version control                        |

## Future Improvements

Possible future enhancements include:

* User authentication
* Role-based access control
* Support agent assignment
* Email notifications
* Ticket pagination
* PostgreSQL support
* Docker containerization
* Automated unit and integration tests
* File attachments
* Ticket activity history
* Deployment to AWS
* Production monitoring and logging
