from db.models import Ticket


class TicketsManager():
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def get_all_tickets(self):
        tickets = self.session.query(Ticket).all()

        self.session.close()

        return tickets

    def create_ticket(self, ticket_data: dict):
        
        ticket = Ticket(
            submission_date=ticket_data.get('submission_date'),
            customer_name=ticket_data.get('customer_name'),
            room_number=ticket_data.get('room_number'),
            problem_title=ticket_data.get('problem_title'),
            state_id=ticket_data.get('state_id')
        )

        # Добавляем тикет в сессию
        self.session.add(ticket)

        # Фиксируем изменения в базе данных
        self.session.commit()
        self.session.close()

        return True
    
    def remove_ticket(self, ticket_id: int):
        # Получаем тикет по его идентификатору
        ticket = self.session.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

        if ticket:
            # Удаляем тикет из сессии
            self.session.delete(ticket)

            self.session.commit()
            result = True
        else:
            print(f"Тикет с идентификатором {ticket_id} не найден.")
            result = False
        
        # Закрываем сессию
        self.session.close()

        return result
    
    