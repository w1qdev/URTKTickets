from db.models import Teachers, Tickets


class TeachersManager():
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    # checked - all good
    def get_teacher_by_id(self, teacher_id: int) -> Teachers:
        return self.session.query(Teachers).filter(Teachers.teacher_id == teacher_id).first()

    # def get_teacher_by_ticket_id(self, ticket_id: int):
    #     return self.session.query()

    # checked - all good
    def get_all_teachers(self):
        return self.session.query(Teachers).all()
    
    def get_all_administrators(self):
        return self.session.query(Teachers).filter(Teachers.role == "administrator").all()

    # checked - all good
    def add_teacher(self, teacher_data: dict) -> Teachers:
        # Проверка на существующего учителя
        existing_teacher = self.session.query(Teachers).filter_by(teacher_name=teacher_data['teacher_name']).first()
        if existing_teacher:
            return existing_teacher
        
        # Если учитель не существует, создаем нового
        new_teacher = Teachers(**teacher_data)
        self.session.add(new_teacher)
        self.session.commit()
        return new_teacher
    
    # checked - all good
    def delete_teacher(self, teacher_id: int):
        teacher = self.session.query(Teachers).filter(Teachers.teacher_id == teacher_id).first()
        if teacher:
            self.session.delete(teacher)
            self.session.commit()
        
