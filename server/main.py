from fastapi import FastAPI
from EntityModels.ticket import Ticket


app = FastAPI()


# tickets
# get all tickets
@app.get("/api/ticket/all")
def get_all_tickets():
    return {"tickets": [
        { "id": 1, "title": "Устранение технических неполадок", "description": "проблема 1, проблема 2, проблема 3....", "location": "аудитория №41", "customer": "Елена Бушмелева", "date": "14.02.2024", "status": "awaiting review"},
        { "id": 2, "title": "Устранение технических неполадок", "description": "проблема 1, проблема 2, проблема 3....", "location": "аудитория №41", "customer": "Елена Бушмелева", "date": "14.02.2024", "status": "awaiting review"},
        { "id": 3, "title": "Устранение технических неполадок", "description": "проблема 1, проблема 2, проблема 3....", "location": "аудитория №41", "customer": "Елена Бушмелева", "date": "14.02.2024", "status": "awaiting review"},
        { "id": 4, "title": "Устранение технических неполадок", "description": "проблема 1, проблема 2, проблема 3....", "location": "аудитория №41", "customer": "Елена Бушмелева", "date": "14.02.2024", "status": "awaiting review"},
    ]}


# get current ticket
@app.get("/api/ticket/{ticket_id}")
def get_ticket_by_id(ticket_id: int):
    return {"ticket_id": ticket_id}


# create a ticket
@app.post("/api/ticket/create")
def create_ticket(ticket: Ticket):
    return ticket

# get current ticket
@app.delete("/api/ticket/{ticket_id}")
def get_ticket_by_id(ticket_id: int):
    return {"ticket_id": ticket_id}

# get current ticket
@app.get("/api/")
def get_ticket_by_id(ticket_id: int):
    return {"status": "OK"}