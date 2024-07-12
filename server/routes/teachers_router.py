# teachers_router.py
from fastapi import APIRouter
from db.managers.teachers_manager import TeachersManager 
from db.db import SessionLocal

teachers_router = APIRouter()
teachers_manager = TeachersManager(SessionLocal)  


@teachers_router.post("/api/teachers/")
async def create_teacher(teacher_data: dict):
    try:
        new_teacher = teachers_manager.add_teacher(teacher_data)
        return new_teacher
    except Exception as ex:
        print(ex)
        return {"error": "Internal Server Error"}, 500


@teachers_router.delete("/api/teachers/{teacher_id}")
async def delete_teacher(teacher_id: int):
    try:
        teacher = teachers_manager.get_teacher_by_id(teacher_id)

        if not teacher:
            return {"message": "Учитель не найден"}, 404

        teachers_manager.delete_teacher(teacher_id)
        return {"message": "Учитель успешно удалён"}
    except Exception as ex:
        print(ex)
        return {"error": "Internal Server Error"}, 500
    

@teachers_router.get("/api/teachers/")
async def get_all_teachers():
    try: 
        return teachers_manager.get_all_teachers()
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500


@teachers_router.get("/api/teachers/{teacher_id}")
async def get_teacher_by_id(teacher_id: int):
    try:
        teacher = teachers_manager.get_teacher_by_id(teacher_id)

        if not teacher:
            return {"message": "Учитель не найден"}
        return teacher
    except Exception as ex:
        print(ex)
        return {"error": "Server Internal Error"}, 500
