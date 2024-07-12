import uvicorn
import os
import threading
import json
from time import sleep
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import FileResponse

from db.managers.teachers_manager import TeachersManager
from db.managers.ticket_state_manager import TicketStatesManager
from db.managers.ticket_manager import TicketsManager
from db.managers.task_manager import TasksManager
from db.managers.ticket_priority_manager import TicketPriorityManager
from db.cleaners.tickets_cleaner import TicketsCleaner
from db.cleaners.report_cleaner import ReportCleaner
from db.db import SessionLocal
from docx_helpers.docx import generate_report_file, get_report_file_path
from ws.websocket import WebSocketConnectionManager
from helpers.utils import serialize_sqlalchemy_obj

from routes.teachers_router import teachers_router
from routes.ticket_states_router import ticket_states_router 
from routes.ticket_router import tickets_router

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

# Tickets cleaner
def ticket_cleaner_scheduler():
    tickets_cleaner = TicketsCleaner(SessionLocal)
    while True:
        tickets_cleaner.clean_old_tickets()
        
        # remove all done tickets every 2 hours
        clean_delay = 2 * 60 * 60 
        sleep(clean_delay) 

# Reports cleaner
def report_cleaner_scheduler():
    report_cleaner = ReportCleaner(SessionLocal)
    while True:
        report_cleaner.clean_old_reports()
        
        # remove all reports every 24 hours
        clean_delay = 24 * 60 * 60 
        sleep(clean_delay) 


# TEACHERS API
app.include_router(teachers_router)

# TICKET STATES API
app.include_router(ticket_states_router)

# TICKETS API
app.include_router(tickets_router)


# API эндпоинт для получения задач по ID тикета
@app.get("/api/tasks/{ticket_id}")
async def get_tasks_by_ticket_id(ticket_id: int):
    try:
        tasks = tasks_manager.get_tasks_by_ticket_id(ticket_id)
        return tasks
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

# API эндпоинт для удаления задачи по ID
@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    try:
        result = tasks_manager.delete_task(task_id)
        return {"success": result}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

# API эндпоинт для удаления всех задач
@app.delete("/api/tasks/")
async def delete_all_task():
    try:
        tasks_manager.delete_all_tasks()
        return {"message": "Все задачи удалены"}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@app.get("/api/tasks/")
async def get_all_tasks():
    try:
        all_tasks = tasks_manager.get_all_tasks()
        return all_tasks
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

# Ticket Priorities API
# TODO: Проверить работу API
@app.get("/api/ticket_prorities/")
async def get_all_ticket_priorities():
    try:
        all_ticket_priorities = ticket_priority_manager.get_all_ticket_priorities()
        return all_ticket_priorities
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@app.post("/api/ticket_prorities/")
async def create_ticket_priority(ticket_priority_data: dict):
    try:
        new_ticket_priority = ticket_priority_manager.create_ticket_priority(ticket_priority_data)
        return new_ticket_priority
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@app.delete("/api/ticket_prorities/{ticket_priority_id}")
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
        return {"error": "Internal Server Error"}, 500

@app.get("/download-report/{filename}")
async def download_report(filename: str):
    try:
        report_path = os.path.join(os.path.dirname(__file__), "reports", filename)
        
        if not os.path.exists(report_path):
            return {"message": "File not found"}, 404 
        
        # Возвращаем файл как ответ
        return FileResponse(path=report_path, filename=filename)
    except Exception as e:
        return {"error": "Internal Server Error"}, 500

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
                and get the data of user using message['teacher_id']
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
    ticket_cleaner_thread = threading.Thread(target=ticket_cleaner_scheduler)
    ticket_cleaner_thread.start()

    # Создание и запуск потока для очистки отчетов
    report_cleaner_thread = threading.Thread(target=report_cleaner_scheduler)
    report_cleaner_thread.start()

    # Ожидание завершения потоков
    uvicorn_thread.join()
    ticket_cleaner_thread.join()
    report_cleaner_thread.join()