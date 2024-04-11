from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()

class Teachers(Base):
    __tablename__ = 'Teachers'

    teacher_id = Column(Integer, primary_key=True)
    teacher_name = Column(String(100))
    department = Column(String(100), default="none")
    role = Column(String(50))


class TicketStates(Base):
    __tablename__ = 'TicketStates'

    state_id = Column(Integer, primary_key=True)
    state_name = Column(String(50))


class TicketPriority(Base):
    __tablename__ = 'TicketPriorities'

    priority_id = Column(Integer, primary_key=True)
    priority_name = Column(String(50), nullable=False)


class Tickets(Base):
    __tablename__ = 'Tickets'

    ticket_id = Column(Integer, primary_key=True)
    submission_date = Column(String)
    customer_name = Column(String(100))
    room_number = Column(String(20))
    problem_title = Column(String(255))
    state_id = Column(Integer, ForeignKey('TicketStates.state_id'))
    teacher_id = Column(Integer, ForeignKey("Teachers.teacher_id"))
    priority_id = Column(Integer, ForeignKey("TicketPriorities.priority_id"))
    teacher = relationship("Teachers")
    state = relationship("TicketStates")
    priority = relationship("TicketPriorities")
    

class Tasks(Base):
    __tablename__ = 'Tasks'

    task_id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey('Tickets.ticket_id'))
    pc_name = Column(String(50))
    task_description = Column(Text)
    ticket = relationship("Tickets")