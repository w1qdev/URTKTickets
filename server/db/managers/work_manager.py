from db.models import Works


class WorksManager:
    def __init__(self, SessionLocal):
        self.session = SessionLocal()

    def create_work(self, work_data: dict):
        try:
            work = Works(**work_data)
            self.session.add(work)
            self.session.commit()
            return work
        finally:
            self.session.close()

    def get_work_by_id(self, work_id: int):
        return self.session.query(Works).filter(Works.work_id == work_id).first()

    def get_works_by_task_id(self, task_id: int):
        return self.session.query(Works).filter(Works.task_id == task_id).all()

    def delete_work(self, work_id: int):
        work = self.get_work_by_id(work_id)
        if work:
            self.session.delete(work)
            self.session.commit()
            return True
        return False