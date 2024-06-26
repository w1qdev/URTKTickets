from db.models import Tickets, Tasks
# from helpers.utils import serialize_sqlalchemy_obj


def serialize_sqlalchemy_obj(obj):
    """Функция для сериализации объектов SQLAlchemy"""
    return {column.name: getattr(obj, column.name) for column in obj.__table__.columns}


class TicketsManager():
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def get_all_tickets(self):
        # Получение всех тикетов
        try: 
            tickets = self.session.query(Tickets).all()

            return tickets
        finally:
            self.session.close()


    def create_ticket(self, ticket_data: dict):
        # Создание нового тикета
        try:
            ticket = Tickets(
                submission_date=ticket_data.get('submission_date'),
                customer_name=ticket_data.get('customer_name'),
                room_number=ticket_data.get('room_number'),
                problem_title=ticket_data.get('problem_title'),
                state_id=ticket_data.get('state_id'),
                teacher_id=ticket_data.get('teacher_id'),
                priority_id=ticket_data.get('priority_id'),
                deadline_date=ticket_data.get('deadline_date'),
                problem_description=ticket_data.get('problem_description'),
                created_at=ticket_data.get('createdAt')
            )

            # Добавление задач к тикету
            tasks_data = ticket_data.get('tasks', [])
            for task_data in tasks_data:
                task = Tasks(
                    ticket=ticket,
                    pc_name=task_data.get('pc_name'),
                    task_description=task_data.get('task_description')
                )
                self.session.add(task)

            self.session.add(ticket)
            self.session.commit()

            # Сериализация тикета
            serialized_ticket = serialize_sqlalchemy_obj(ticket)
        
            if hasattr(ticket, 'tasks'):
                serialized_ticket['tasks'] = [serialize_sqlalchemy_obj(task) for task in ticket.tasks]
            else:
                serialized_ticket['tasks'] = []

            return serialized_ticket
        finally: 
            self.session.close()

    def change_ticket_status(self, ticket_id: int, new_status_id: int):
        # Обновление статуса тикета по его идентификатору
        try:
            ticket = self.session.query(Tickets).filter(Tickets.ticket_id == ticket_id).first()

            if not ticket:
                return False  # Тикет не найден

            ticket.state_id = new_status_id
            self.session.commit()
            return True  # Статус успешно обновлен
        
        except Exception as e:
            print(f"An error occurred while changing ticket status: {e}")
            self.session.rollback()

            return False  # Произошла ошибка, статус не обновлен
    
    def remove_ticket(self, ticket_id: int):
        # Удаление тикета и связанных задач по id тикета
        try:
            # Находим тикет
            ticket = self.session.query(Tickets).filter(Tickets.ticket_id == ticket_id).first()
            
            if ticket:
                # Удаляем связанные задачи
                self.session.query(Tasks).filter(Tasks.ticket_id == ticket_id).delete()
                
                # Удаляем сам тикет
                self.session.delete(ticket)
                self.session.commit()
                return True
            return False
        except Exception as e:
            print(f"An error occurred while removing the ticket: {e}")
            self.session.rollback()
            return False
    
    def get_ticket_by_id(self, ticket_id: int):
        # Получение данных тикета по id
        return self.session.query(Tickets).filter(Tickets.ticket_id == ticket_id).first()
    
    def get_tickets_by_teacher_id(self, teacher_id: int):
        # Получение определённого тикета по id учителя
        return self.session.query(Tickets).filter(Tickets.teacher_id == teacher_id).all()

    def remove_all_tickets_and_tasks(self):
        # Удаление всех тикетов и связанных задач
        try:
            # Удаление всех задач
            self.session.query(Tasks).delete()
            
            # Удаление всех тикетов
            self.session.query(Tickets).delete()
            
            self.session.commit()
            return True
        
        except Exception as e:
            print(f"An error occurred while removing all tickets and tasks: {e}")
            self.session.rollback()
            return False
    
    def add_ticket_performer(self, ticket_id: int, performer_name: str):
        try:
            ticket = self.session.query(Tickets).filter(Tickets.ticket_id == ticket_id).first()

            if not ticket:
                return False  # Тикет не найден

            ticket.performer_name = performer_name
            self.session.commit()
            return True  # Исполнитель успешно добавлен к тикету
            
        except Exception as e:
            print(f"An error occurred while adding performer to ticket: {e}")
            self.session.rollback()
            return False  # Произошла ошибка, исполнитель не добавлен