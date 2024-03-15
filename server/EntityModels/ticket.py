from pydantic import BaseModel


class Badge(BaseModel):
    id: int
    title: str

class Tasks(BaseModel):
    id: int
    pc_num: str
    badges: list[Badge]

class Ticket(BaseModel):
    audience: int
    tasks: list[Tasks]
    customer: str
