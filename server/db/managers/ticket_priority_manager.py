from db.models import TicketPriority


class TicketPriorityManager:
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def get_all_ticket_priorities(self):
        return self.session.query(TicketPriority).all()

    def create_ticket_priority(self, ticket_priority_data: dict):
        ticket_priority = TicketPriority(**ticket_priority_data)
        self.session.add(ticket_priority)
        self.session.commit()
        self.session.refresh(ticket_priority)
        return ticket_priority

    def remove_ticket_priority_by_id(self, ticket_priority_id: int):
        ticket_priority = self.session.query(TicketPriority).filter(TicketPriority.priority_id == ticket_priority_id).first()
        if ticket_priority:
            self.session.delete(ticket_priority)
            self.session.commit()
            return ticket_priority
        return None

    
