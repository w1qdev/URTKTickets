from db.models import Tasks


class TasksManager:
    def __init__(self, LocalSession):
        self.session = LocalSession()

    def create_task(self, task_data: dict):
        try:
            task = Tasks(
                ticket_id=task_data.get('ticket_id'),
                pc_name=task_data.get('pc_name'),
                task_description=task_data.get('task_description')
            )
            self.session.add(task)
            self.session.commit()
            return task
        finally:
            self.session.close()

    def get_tasks_by_ticket_id(self, ticket_id: int):
        return self.session.query(Tasks).filter(Tasks.ticket_id == ticket_id).all()

    def get_all_tasks(self):
        return self.session.query(Tasks).all()

    def delete_task(self, task_id: int):
        task = self.session.query(Tasks).filter(Tasks.task_id == task_id).first()
        if task:
            self.session.delete(task)
            self.session.commit()
            return True
        return False
    