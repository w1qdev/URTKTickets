from pydantic import BaseModel
from typing import List


class TaskModel(BaseModel):
    text: str
    description: str

class ProblemModel(BaseModel):
    pc_name: str
    tasks: List[TaskModel]
    description: str

class TicketModel(BaseModel):
    submission_date: str
    customer_name: str
    room_number: str
    problem_title: str
    problems: List[ProblemModel]