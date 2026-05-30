from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from src.database.connection import Base

# Class inherit 'declarative_base' is transformed to a table in Database SQL
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True) # Already is Index automatically 
    user_id = Column(String, nullable=False, index=True) 
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # Allows timezone compared UTC, and 'func' save exactly moment inside own SQL not in Python 

# Token's persistence 
class UserConfig(Base):
    __tablename__ = "user_configs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, unique=True, nullable=False, index=True)
    git_token = Column(String, nullable=False)