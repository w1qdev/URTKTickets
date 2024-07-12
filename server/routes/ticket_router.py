from fastapi import APIRouter, Query
from db.managers.ticket_manager import TicketsManager
from db.managers.task_manager import TasksManager
from db.managers.teachers_manager import TeachersManager 
from db.db import SessionLocal


tickets_router = APIRouter()
tickets_manager = TicketsManager(SessionLocal)
tasks_manager = TasksManager(SessionLocal)
teachers_manager = TeachersManager(SessionLocal)


@tickets_router.post("/api/tickets/")
async def create_ticket(ticket_data: dict):
    try:
        new_ticket = tickets_manager.create_ticket(ticket_data)
        return { 
            'message': "Новый тикет успешно создан",
            'status': 'OK',
            'ticket': new_ticket
        }
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@tickets_router.delete("/api/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    try:
        deleted = tickets_manager.remove_ticket(ticket_id)
        if not deleted:
            return {"message": "Тикет не найден"}
        return {"message": "Тикет успешно удалён"}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@tickets_router.get("/api/tickets/")
async def get_tickets(
        role: str = Query(...), 
        user_id: int = Query(...), 
        username: str = Query(...)
    ):
    
    try:
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
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500


@tickets_router.put("/api/tickets/{ticket_id}/change_status/")
async def change_ticket_status(ticket_id: int, status_data: dict):
    try:
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
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@tickets_router.delete("/api/tickets/")
async def remove_all_tickets_and_tasks():
    try:
        tickets_manager.remove_all_tickets_and_tasks()
        return { "message": "All tickets and tasks removed" }
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

# TASKS API
@tickets_router.post("/api/tasks/")
async def create_task(task_data: dict):
    try:
        task = tasks_manager.create_task(task_data)
        return task
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500