from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import timezone
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
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone.utc), server_default=func.now())

    config = relationship("UserConfig", back_populates="user", uselist=False) 
    # 'back_populates' connects the variable's relationship of table relationated 
    # 'uselist' is the information if table is 'Many to many'

# Token's persistence 
class UserConfig(Base):
    __tablename__ = "user_configs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    git_token = Column(String, nullable=False)

    user = relationship("User", back_populates="config", uselist=False)