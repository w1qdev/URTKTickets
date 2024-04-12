from db.models import Tickets, Tasks


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
                deadline_date=ticket_data.get('deadline_date')
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
        
            return ticket
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
        # Удаление тикета по id
        ticket = self.session.query(Tickets).filter(Tickets.ticket_id == ticket_id).first()

        if ticket:
            self.session.delete(ticket)
            self.session.commit()
            return True
        return False
    
    def get_tickets_by_teacher_id(self, teacher_id: int):
        # Получение определённого тикета по id
        return self.session.query(Tickets).filter(Tickets.teacher_id == teacher_id).all()
    
    def remove_all_tickets(self):
        # Удаление всех тикетов
        try:
            self.session.query(Tickets).delete()
            self.session.commit()
            return True
        
        except Exception as e:
            print(f"An error occurred while removing all tickets: {e}")
            self.session.rollback()
            return False
    