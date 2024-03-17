from db.models import Teachers


class TeachersManager():
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def get_teacher_by_id(self, teacher_id: int) -> Teachers:
        return self.session.query(Teachers).filter(Teachers.teacher_id == teacher_id).first()

    def get_all_teachers(self):
        return self.session.query(Teachers).all()
        
    def add_teacher(self, teacher_data: dict) -> Teachers:
        new_teacher = Teachers(**teacher_data)
        self.session.add(new_teacher)
        self.session.commit()
        return new_teacher
    
    def delete_teacher(self, teacher_id: int):
        teacher = self.session.query(Teachers).filter(Teachers.teacher_id == teacher_id).first()
        if teacher:
            self.session.delete(teacher)
            self.session.commit()
        
