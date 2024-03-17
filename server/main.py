from fastapi import FastAPI
from db import SessionLocal
from db.ticket_manager import TicketsManager
from db.api_models import TicketModel, TaskModel, ProblemModel


app = FastAPI()

ticket_manager = TicketsManager(SessionLocal)


# tickets
# get all tickets
@app.get("/api/ticket/all")
async def get_all_tickets():
    all_tickets = ticket_manager.get_all_tickets()

    return {"tickets": all_tickets}


# get current ticket
@app.get("/api/ticket/{ticket_id}")
async def get_ticket_by_id(ticket_id: int):
    return {"ticket_id": ticket_id}


# create a ticket
@app.post("/api/ticket/create")
async def create_ticket(ticket_data: TicketModel):
    ticket_manager.create_ticket(ticket_data)

    return ticket_data

# get current ticket
@app.delete("/api/ticket/{ticket_id}")
async def get_ticket_by_id(ticket_id: int):
    return {"ticket_id": ticket_id}