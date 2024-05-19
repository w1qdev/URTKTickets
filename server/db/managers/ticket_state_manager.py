from db.models import TicketStates


class TicketStatesManager:
    def __init__(self, LocalSession):
        self.session = LocalSession()

    def initialize_default_states(self):
        default_states = ["Under review", "In Progress", "Completed"]
        
        # Check if the default states already exist
        existing_states = self.session.query(TicketStates).filter(TicketStates.name.in_(default_states)).all()
        existing_state_names = [state.name for state in existing_states]

        # Find which default states are missing
        missing_states = [state for state in default_states if state not in existing_state_names]

        # Add missing default states
        for state in missing_states:
            new_state = TicketStates(name=state)
            self.session.add(new_state)
        
        # Commit the session to save changes
        self.session.commit()

    # checked - all good
    def add_ticket_state(self, state_data: dict) -> TicketStates:
        new_state = TicketStates(**state_data)
        self.session.add(new_state)
        self.session.commit()
        return new_state

    # checked - all good
    def delete_ticket_state(self, state_id: int):
        state = self.session.query(TicketStates).filter(TicketStates.state_id == state_id).first()
        if state:
            self.session.delete(state)
            self.session.commit()

    # checked - all good
    def get_ticket_state_by_id(self, state_id: int) -> TicketStates:
        return self.session.query(TicketStates).filter(TicketStates.state_id == state_id).first()

    # checked - all good
    def get_all_ticket_states(self):
        return self.session.query(TicketStates).all()