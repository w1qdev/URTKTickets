from db.models import Tickets, TicketStates, Tasks, Works


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
                teacher_id=ticket_data.get('teacher_id')
            )

            # Создание задач и добавление их в тикет
            tasks_data = ticket_data.get('tasks', [])
            for task_data in tasks_data:
                task = Tasks(
                    ticket=ticket,
                    pc_name=task_data.get('pc_name'),
                    task_description=task_data.get('task_description')
                )

                # Создание работ и добавление их к задаче
                works_data = task_data.get('works', [])
                for work_data in works_data:
                    work = Works(
                        task=task,
                        task_description=work_data.get('task_description')
                    )
                    self.session.add(work)

                self.session.add(task)

            self.session.add(ticket)
            self.session.commit()
        
            return ticket
        finally: 
            self.session.close()

    
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
    
    