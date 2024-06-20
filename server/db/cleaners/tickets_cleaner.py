from datetime import datetime, timedelta
from db.models import Tickets
from sqlalchemy import and_


class TicketsCleaner:
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def clean_old_tickets(self):
        # Очистка тикетов, у которых дата завершения более чем 6 месяцев назад
        print(f"Ticket cleaning started at {datetime.now()}")
        try:
            print(f"Ticket cleaning started at {datetime.now()}")

            # удаление выполненных тикетов через 6 месяцев
            six_months_ago = datetime.now() - timedelta(days=182)  

            # Удалить тикеты и связанные задачи
            deleted_tickets = self.session.query(Tickets) \
                .filter(and_(Tickets.created_at < six_months_ago, Tickets.state_id == 3)) \
                .delete()

            # Подтвердить изменения
            self.session.commit()

            return deleted_tickets
        except Exception as ex:
            print(f"An error occurred while cleaning old tickets: {ex}")
            self.session.rollback()
            return 0  # Возвращает 0 в случае ошибки
        finally:
            self.session.close()   
            print(f"Ticket cleaning ended at {datetime.now()}")
