from fastapi import FastAPI, HTTPException
from fastapi.openapi.utils import get_openapi
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.managers.ticket_manager import TicketsManager
from db import SessionLocal
from db.models import Base
from db.managers.teachers_manager import TeachersManager
from db.managers.ticket_state_manager import TicketStatesManager
from db.managers.ticket_manager import TicketsManager


# Настройка документации OpenAPI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom Title",
        version="2.5.0",
        description="This is a very custom OpenAPI schema",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Подключение к базе данных
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


# Создание экземпляров менеджеров
teachers_manager = TeachersManager(SessionLocal)
ticket_states_manager = TicketStatesManager(SessionLocal)
tickets_manager = TicketsManager(SessionLocal)

app = FastAPI()
app.openapi = custom_openapi()


# TEACHERS API
@app.post("/api/teachers/")
async def create_teacher(teacher_data: dict):
    new_teacher = teachers_manager.add_teacher(teacher_data)
    return new_teacher

@app.delete("/api/teachers/{teacher_id}")
async def delete_teacher(teacher_id: int):
    teacher = teachers_manager.get_teacher_by_id(teacher_id)
    if not teacher:
        return {"message": "Учитель не найден"}, 404
    teachers_manager.delete_teacher(teacher_id)
    return {"message": "Учитель успешно удалён"}

@app.get("/api/teachers/")
async def get_all_teachers():
    return teachers_manager.get_all_teachers()


# TICKET STATES API
@app.post("/api/ticket_states/")
async def create_ticket_state(state_name: str):
    new_state = ticket_states_manager.add_ticket_state(state_name)
    return new_state

@app.delete("/api/ticket_states/{state_id}")
async def delete_ticket_state(state_id: int):
    state = ticket_states_manager.get_ticket_state_by_id(state_id)
    if not state:
        return {"message": "Состояние тикета не найдено"}
    ticket_states_manager.delete_ticket_state(state_id)
    return {"message": "Состояние для тикета удалено успешно"}

@app.get("/api/ticket_states/")
async def get_all_ticket_states():
    return ticket_states_manager.get_all_ticket_states()


# TICKETS API
@app.post("/api/tickets/")
async def create_ticket(ticket_data: dict):
    new_ticket = tickets_manager.create_ticket(ticket_data)
    return new_ticket

@app.get("/api/tickets/")
async def get_all_tickets():
    return tickets_manager.get_all_tickets()

@app.delete("/api/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    deleted = tickets_manager.delete_ticket(ticket_id)
    if not deleted:
        return {"message": "Тикет не найден"}
    return {"message": "Тикет успешно удалён"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)