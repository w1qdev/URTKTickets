from fastapi import APIRouter
from db.managers.ticket_state_manager import TicketStatesManager 
from db.db import SessionLocal


ticket_states_router = APIRouter()
ticket_states_manager = TicketStatesManager(SessionLocal)


@ticket_states_router.post("/api/ticket_states/")
async def create_ticket_state(state_data: dict):
    # Создание состояний для тикетов
    try:
        new_state = ticket_states_manager.add_ticket_state(state_data)
        return new_state
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500
    

@ticket_states_router.delete("/api/ticket_states/{state_id}")
async def delete_ticket_state(state_id: int):
    # Удаление состояний для тикетов
    try:
        state = ticket_states_manager.get_ticket_state_by_id(state_id)
        if not state:
            return {"message": "Состояние тикета не найдено"}
        ticket_states_manager.delete_ticket_state(state_id)
        return {"message": "Состояние для тикета удалено успешно"}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@ticket_states_router.get("/api/ticket_states/")
async def get_all_ticket_states():
    # Отправка свех состояний для тикетов
    try: 
        return ticket_states_manager.get_all_ticket_states()
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500


@ticket_states_router.get("/api/ticket_states/{state_id}")
async def get_ticket_state_by_id(state_id: int):
    # получение данных о состоянии тикета по id
    try:
        teacher = ticket_states_manager.get_ticket_state_by_id(state_id)

        if not teacher:
            return {"message": "Состояние тикета не найдено"}
        return teacher
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500