from db.models import TicketStates


class TicketStatesManager:
    def __init__(self, LocalSession):
        self.session = LocalSession()

    def add_ticket_state(self, state_name: str) -> TicketStates:
        new_state = TicketStates(state_name=state_name)
        self.session.add(new_state)
        self.session.commit()
        return new_state

    def delete_ticket_state(self, state_id: int):
        state = self.session.query(TicketStates).filter(TicketStates.state_id == state_id).first()
        if state:
            self.session.delete(state)
            self.session.commit()

    def get_ticket_state_by_id(self, state_id: int) -> TicketStates:
        return self.session.query(TicketStates).filter(TicketStates.state_id == state_id).first()

    def get_all_ticket_states(self):
        return self.session.query(TicketStates).all()