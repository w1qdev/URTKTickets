from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.models import Base
from db.managers.teachers_manager import TeachersManager
from db.managers.ticket_state_manager import TicketStatesManager
from db.managers.ticket_manager import TicketsManager
from db.managers.task_manager import TasksManager
from db.managers.ticket_priority_manager import TicketPriorityManager


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
ticket_priority_manager = TicketPriorityManager(SessionLocal)


app = FastAPI()
app.openapi = custom_openapi()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


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
    print(ticket_data)
    tickets_manager.create_ticket(ticket_data)
    return { 
        'message': "Новый тикет успешно создан",
        'status': 'OK'
    }

@app.delete("/api/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    deleted = tickets_manager.remove_ticket(ticket_id)
    if not deleted:
        return {"message": "Тикет не найден"}
    return {"message": "Тикет успешно удалён"}

@app.get("/api/tickets/")
async def get_tickets(
        role: str = Query(...), 
        user_id: int = Query(...), 
        username: str = Query(...)
    ):
    
    if role == "administrator":
        tickets = tickets_manager.get_all_tickets()
        tickets_with_tasks = []

        for ticket in tickets:
            ticket_data = ticket.__dict__
            tasks = tasks_manager.get_tasks_by_ticket_id(ticket.ticket_id)
            ticket_data["tasks"] = [task.__dict__ for task in tasks]
            tickets_with_tasks.append(ticket_data)

        return {"tickets": tickets_with_tasks}
    
    elif role == "teacher":
        # Проверяем, существует ли преподаватель с указанным user_id
        teacher = teachers_manager.get_teacher_by_id(teacher_id=user_id)
        if not teacher:
            teacher_data = { 'teacher_name': username, 'role': role }

            teachers_manager.add_teacher(teacher_data=teacher_data)
            return {"message": "Преподаватель с таким id не существует"}
        
        # Получаем все тикеты, созданные указанным преподавателем
        teacher_tickets = tickets_manager.get_tickets_by_teacher_id(user_id)
        tickets_with_tasks = []

        for ticket in teacher_tickets:
            ticket_data = ticket.__dict__
            tasks = tasks_manager.get_tasks_by_ticket_id(ticket.ticket_id)
            ticket_data["tasks"] = [task.__dict__ for task in tasks]
            tickets_with_tasks.append(ticket_data)

        return {"tickets": tickets_with_tasks}
    else:
        return {"message": "Роль неверна"}

@app.put("/api/tickets/{ticket_id}/change_status/")
async def change_ticket_status(ticket_id: int, status_data: dict):
    changed_ticket = tickets_manager.change_ticket_status(ticket_id, status_data['new_status_id'])

    if changed_ticket:
        return {
            "message": "Статус тикета успешно изменен",
            "status": "OK"
        }
    else:
        return {"message": "Ошибка при изменении статуса тикета"}


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

# API эндпоинт для удаления всех задач
@app.delete("/api/tasks/")
async def delete_all_task():
    tasks_manager.delete_all_tasks()
    return {"message": "Все задачи удалены"}

@app.get("/api/tasks/")
async def get_all_tasks():
    all_tasks = tasks_manager.get_all_tasks()
    return all_tasks


# Ticket Priorities API
# TODO: Проверить работу API
@app.get("/api/ticket_prorities/")
async def get_all_ticket_priorities():
    all_ticket_priorities = ticket_priority_manager.get_all_ticket_priorities()
    return all_ticket_priorities

@app.post("/api/ticket_prorities/")
async def create_ticket_priority(ticket_priority_data: dict):
    new_ticket_priority = ticket_priority_manager.create_ticket_priority(ticket_priority_data)
    return new_ticket_priority

@app.delete("/api/ticket_prorities/{ticket_priority_id}")
async def remove_ticket_priority_by_id(ticket_priority_id: int):
    deleted_ticket_priority = ticket_priority_manager.remove_ticket_priority_by_id(ticket_priority_id)
    if deleted_ticket_priority:
        return {"message": "Ticket priority deleted successfully"}
    else:
        return {"message": "Ticket priority not found"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)