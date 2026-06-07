from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from datetime import utc
from src.database.connection import Base

# Class inherit 'declarative_base' is transformed to a table in Database SQL
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True) # Already is Index automatically 
    user_id = Column(String, nullable=False, index=True) 
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # Allows timezone compared UTC, and 'func' save exactly moment inside own SQL not in Python 

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    created_at = Column(DateTime(timezone=utc), server_default=func.now())

# Token's persistence 
class UserConfig(Base):
    __tablename__ = "user_configs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    git_token = Column(String, nullable=False)