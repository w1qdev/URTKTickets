import uvicorn
import os
import threading
import json
from time import sleep
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager
from fastapi.openapi.utils import get_openapi
from fastapi.responses import FileResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.models import Base
from db.managers.teachers_manager import TeachersManager
from db.managers.ticket_state_manager import TicketStatesManager
from db.managers.ticket_manager import TicketsManager
from db.managers.task_manager import TasksManager
from db.managers.ticket_priority_manager import TicketPriorityManager
from docx_helpers.docx import generate_report_file, get_report_file_path
from middlewares.RemoveReportAfterResponse import RemoveReportAfterResponse
from middlewares.AddProcessTimeHeader import AddProcessTimeHeader
from db.cleaners.tickets_cleaner import TicketsCleaner
from ws.websocket import WebSocketConnectionManager
from helpers.utils import serialize_sqlalchemy_obj


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
tickets_cleaner = TicketsCleaner(SessionLocal)
ws_manager = WebSocketConnectionManager()

# initializing default values
# ticket_states_manager.initialize_default_states()
# ticket_priority_manager.initialize_default_priorities()


app = FastAPI()
app.openapi = custom_openapi()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
app.add_middleware(RemoveReportAfterResponse)
app.add_middleware(AddProcessTimeHeader)

# Tickets cleaner
def ticket_cleaner_scheduler():
    cleaner = TicketsCleaner(SessionLocal)
    while True:
        cleaner.clean_old_tickets()
        sleep(2 * 60 * 60)  # Спим 2 часа


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
    return { 
        'message': "Новый тикет успешно создан",
        'status': 'OK',
        'ticket': new_ticket
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

    if ('administratorUsername' in status_data):
        tickets_manager.add_ticket_performer(ticket_id, status_data['administratorUsername'])
    changed_ticket = tickets_manager.change_ticket_status(ticket_id, status_data['new_status_id'])

    if changed_ticket:
        return {
            "message": "Статус тикета успешно изменен",
            "status": "OK"
        }
    else:
        return {"message": "Ошибка при изменении статуса тикета"}

@app.delete("/api/tickets/")
async def remove_all_tickets_and_tasks():
    tickets_manager.remove_all_tickets_and_tasks()
    return { "message": "All tickets and tasks removed" }


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

# Generate and download report
@app.post("/generate-report/")
async def generate_report(data: dict):
    try:    
        filename = f"report_{data['ticketData']['ticket_id']}.docx"
        report_file = get_report_file_path(filename)

        # TODO: раскоментируй каогда закончишь дебажить
        # if report_file != False:
        #     return {"filename": filename}
        
        report_filename = generate_report_file(data)
        # Возвращаем имя файла
        return {"filename": report_filename}
    except Exception as e:
        return {"message": "Something gone wrong | Internal Error"}

@app.get("/download-report/{filename}")
async def download_report(filename: str):
    try:
        report_path = os.path.join(os.path.dirname(__file__), "reports", filename)
        
        if not os.path.exists(report_path):
            return {"message": "File not found"}
        
        # Возвращаем файл как ответ
        return FileResponse(path=report_path, filename=filename)
    except Exception as e:
        return {"message": "Something gone wrong | Internal Error"}

# WebSockets
@app.websocket("/ws/tickets/{client_id}")
async def websocket_tickets(websocket: WebSocket, client_id: int):
    await ws_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            all_tickets = None
            teacher_tickets = None
            teacher_id = None

            """ 
                TODO: there you need to go to MySQL Database 
                and get the data of user using messages['teacher_id']
                if user exist in your database, then just send the tickets
                data for him
                else if user doesn't exist in your database, save this user
                into your database
            """

            if message['action'] == 'update': 
                # Get tickets for the specific teacher
                if (message['ticket_id'] is not None):
                    ticket = tickets_manager.get_ticket_by_id(message['ticket_id'])
                    if ticket:
                        teacher_id = ticket.teacher_id
                        teacher_tickets = tickets_manager.get_tickets_by_teacher_id(teacher_id)

            elif message['action'] == 'remove':
                # Get tickets for the specific teacher
                if (message['teacher_id'] is not None):
                    teacher_id = message['teacher_id']
                    teacher_tickets = tickets_manager.get_tickets_by_teacher_id(teacher_id)
            
            # Get all updated tickets for administrators
            all_tickets = tickets_manager.get_all_tickets()
            # Serialize tickets for administrators
            all_tickets_with_tasks = []
            if all_tickets:
                for ticket in all_tickets:
                    ticket_data = serialize_sqlalchemy_obj(ticket)
                    tasks = tasks_manager.get_tasks_by_ticket_id(ticket.ticket_id)
                    ticket_data["tasks"] = [serialize_sqlalchemy_obj(task) for task in tasks]
                    all_tickets_with_tasks.append(ticket_data)

            all_tickets_response = {"tickets": all_tickets_with_tasks}

            # Serialize tickets for the specific teacher
            teacher_tickets_with_tasks = []
            if teacher_tickets:
                for ticket in teacher_tickets:
                    ticket_data = serialize_sqlalchemy_obj(ticket)
                    tasks = tasks_manager.get_tasks_by_ticket_id(ticket.ticket_id)
                    ticket_data["tasks"] = [serialize_sqlalchemy_obj(task) for task in tasks]
                    teacher_tickets_with_tasks.append(ticket_data)

            teacher_tickets_response = {"tickets": teacher_tickets_with_tasks}

            # Получаем ID пользователя
            user_id = message['user_id']
            if user_id:
                administrators = teachers_manager.get_all_administrators()
                admin_ids = [admin.teacher_id for admin in administrators]

                # Send all tickets to administrators
                if all_tickets_response and teacher_tickets_response:
                    await ws_manager.send_message_to_clients(all_tickets_response, admin_ids)
                    await ws_manager.send_personal_message(teacher_tickets_response, teacher_id)
            else:
                # Send message only to one user
                await ws_manager.send_personal_message({"message": "Invalid user ID"}, client_id)
            
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


def run_uvicorn():
    uvicorn.run(app, host="127.0.0.1", port=8001)

if __name__ == "__main__":
    # Создание и запуск потока для uvicorn
    uvicorn_thread = threading.Thread(target=run_uvicorn)
    uvicorn_thread.start()

    # Создание и запуск потока для очистки тикетов
    cleaner_thread = threading.Thread(target=ticket_cleaner_scheduler)
    cleaner_thread.start()

    # Ожидание завершения потоков
    uvicorn_thread.join()
    cleaner_thread.join()