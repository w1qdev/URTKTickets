from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Строка подключения к базе данных
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"

# Создание экземпляра движка базы данных
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Создание экземпляра сессии для работы с базой данных
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)