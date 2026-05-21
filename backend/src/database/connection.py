from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.core.env import settings

DATABASE_URL = f"postgresql://{settings.USER}:{settings.PASSWORD}@{settings.PORT}/{settings.DATABASE}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 'autocommit' make transaction alone, 'autoflush' syncs in database everytime during workflow, bad for network traffic and avoid errors. 
# In our case only me can make transaction with 'db.commit()' 
Base = declarative_base()
# Creates an one bridge to translate code in Python to SQL
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()