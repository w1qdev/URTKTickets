from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.models import Base
from db.managers.teachers_manager import TeachersManager
from db.managers.ticket_state_manager import TicketStatesManager
from db.managers.ticket_manager import TicketsManager
from db.managers.task_manager import TasksManager
from db.managers.work_manager import WorksManager


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
tasks_manager = TasksManager(SessionLocal)
works_manager = WorksManager(SessionLocal)

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

@app.get("/api/teachers/{teacher_id}")
async def get_teacher_by_id(teacher_id: int):
    teacher = teachers_manager.get_teacher_by_id(teacher_id)

    if not teacher:
        return {"message": "Учитель не найден"}
    return teacher


# TICKET STATES API

@app.post("/api/ticket_states/")
async def create_ticket_state(state_data: dict):
    # Создание состояний для тикетов

    new_state = ticket_states_manager.add_ticket_state(state_data)
    return new_state

@app.delete("/api/ticket_states/{state_id}")
async def delete_ticket_state(state_id: int):
    # Удаление состояний для тикетов

    state = ticket_states_manager.get_ticket_state_by_id(state_id)
    if not state:
        return {"message": "Состояние тикета не найдено"}
    ticket_states_manager.delete_ticket_state(state_id)
    return {"message": "Состояние для тикета удалено успешно"}

@app.get("/api/ticket_states/")
async def get_all_ticket_states():
    # Отправка свех состояний для тикетов

    return ticket_states_manager.get_all_ticket_states()

@app.get("/api/ticket_states/{state_id}")
async def get_ticket_state_by_id(state_id: int):
    # получение данных о состоянии тикета по id

    teacher = ticket_states_manager.get_ticket_state_by_id(state_id)

    if not teacher:
        return {"message": "Состояние тикета не найдено"}
    return teacher


# TICKETS API
@app.post("/api/tickets/")
async def create_ticket(ticket_data: dict):
    new_ticket = tickets_manager.create_ticket(ticket_data)
    return new_ticket

@app.delete("/api/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    deleted = tickets_manager.delete_ticket(ticket_id)
    if not deleted:
        return {"message": "Тикет не найден"}
    return {"message": "Тикет успешно удалён"}

@app.get("/api/tickets/")
async def get_tickets(data: dict):
    role = data.get("role")
    user_id = int(data.get("user_id"))

    if role == "administrator":
        tickets = tickets_manager.get_all_tickets()
        return {"tickets": tickets}
    
    elif role == "teacher":
        # Проверяем, существует ли проподавателем с указанным user_id
        teacher = teachers_manager.get_teacher_by_id(user_id)
        if not teacher:
            return {"message": "Учителя с таким id не существует"}
        
        # Получаем все тикеты, созданные указанным проподавателем
        teacher_tickets = tickets_manager.get_tickets_by_teacher_id(user_id)
        return {"teacher_tickets": teacher_tickets}
    else:
        return {"message": "Роль не верная"}


# TASKS API
@app.post("/api/tasks/")
async def create_task(task_data: dict):
    task = tasks_manager.create_task(task_data)
    return task

# API эндпоинт для получения задач по ID тикета
@app.get("/api/tasks/{ticket_id}")
async def get_tasks_by_ticket_id(ticket_id: int):
    tasks = tasks_manager.get_tasks_by_ticket_id(ticket_id)
    return tasks

# API эндпоинт для удаления задачи по ID
@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    result = tasks_manager.delete_task(task_id)
    return {"success": result}

@app.get("/api/tasks/")
async def get_all_tasks():
    all_tasks = tasks_manager.get_all_tasks()
    return all_tasks



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)