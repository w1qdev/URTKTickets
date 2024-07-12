from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

# Подключение к базе данных
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)