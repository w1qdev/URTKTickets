from fastapi import APIRouter
from db.managers.task_manager import TasksManager
from db.db import SessionLocal

tasks_manager = TasksManager(SessionLocal)
tasks_router = APIRouter()


# API эндпоинт для получения задач по ID тикета
@tasks_router.get("/api/tasks/{ticket_id}")
async def get_tasks_by_ticket_id(ticket_id: int):
    try:
        tasks = tasks_manager.get_tasks_by_ticket_id(ticket_id)
        return tasks
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

# API эндпоинт для удаления задачи по ID
@tasks_router.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    try:
        result = tasks_manager.delete_task(task_id)
        return {"success": result}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

# API эндпоинт для удаления всех задач
@tasks_router.delete("/api/tasks/")
async def delete_all_task():
    try:
        tasks_manager.delete_all_tasks()
        return {"message": "Все задачи удалены"}
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500

@tasks_router.get("/api/tasks/")
async def get_all_tasks():
    try:
        all_tasks = tasks_manager.get_all_tasks()
        return all_tasks
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500