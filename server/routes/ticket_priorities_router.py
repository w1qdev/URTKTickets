from fastapi import APIRouter
from db.managers.ticket_priority_manager import TicketPriorityManager
from db.db import SessionLocal

ticket_priority_manager = TicketPriorityManager(SessionLocal)
ticket_priorities_router = APIRouter()


@ticket_priorities_router.get("/api/ticket_prorities/")
async def get_all_ticket_priorities():
    try:
        all_ticket_priorities = ticket_priority_manager.get_all_ticket_priorities()
        return all_ticket_priorities
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@ticket_priorities_router.post("/api/ticket_prorities/")
async def create_ticket_priority(ticket_priority_data: dict):
    try:
        new_ticket_priority = ticket_priority_manager.create_ticket_priority(ticket_priority_data)
        return new_ticket_priority
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@ticket_priorities_router.delete("/api/ticket_prorities/{ticket_priority_id}")
async def remove_ticket_priority_by_id(ticket_priority_id: int):
    try:
        deleted_ticket_priority = ticket_priority_manager.remove_ticket_priority_by_id(ticket_priority_id)
        if deleted_ticket_priority:
            return {"message": "Ticket priority deleted successfully"}
        else:
            return {"message": "Ticket priority not found"}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500