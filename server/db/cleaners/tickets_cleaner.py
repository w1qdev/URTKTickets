from datetime import datetime, timedelta
from db.models import Tickets, Tasks


class TicketsCleaner:
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def clean_old_tickets(self):
        # Очистка тикетов, у которых дата завершения более чем 6 месяцев назад
        print(f"Ticket cleaning started at {datetime.now()}")
        try:
            six_months_ago = datetime.now() - timedelta(days=6*30)  # Примерное значение для 6 месяцев
            old_tickets = self.session.query(Tickets).filter(Tickets.deadline_date < six_months_ago).all()

            for ticket in old_tickets:
                # Удаление задач, связанных с тикетом
                self.session.query(Tasks).filter(Tasks.ticket_id == ticket.ticket_id).delete()
                # Удаление самого тикета
                self.session.delete(ticket)

            self.session.commit()
            return len(old_tickets)  # Возвращает количество удаленных тикетов
        except Exception as e:
            print(f"An error occurred while cleaning old tickets: {e}")
            self.session.rollback()
            return 0  # Возвращает 0 в случае ошибки
        finally:
            self.session.close()   
            print(f"Ticket cleaning ended at {datetime.now()}")
