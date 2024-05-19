from db.models import TicketPriority


class TicketPriorityManager:
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def initialize_default_priorities(self):
        default_priorities = ["Низкий", "Средний", "Высокий"]
        
        # Check if the default priorities already exist
        existing_priorities = self.session.query(TicketPriority).filter(TicketPriority.name.in_(default_priorities)).all()
        existing_priority_names = [priority.name for priority in existing_priorities]

        # Find which default priorities are missing
        missing_priorities = [priority for priority in default_priorities if priority not in existing_priority_names]

        # Add missing default priorities
        for priority in missing_priorities:
            new_priority = TicketPriority(name=priority)
            self.session.add(new_priority)
        
        # Commit the session to save changes
        self.session.commit()

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

    
