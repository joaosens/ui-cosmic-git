# -*- coding: utf-8 -*-

import sys
from urllib.parse import quote_plus # For make URL Encode to special chars acts equal URL Encoding

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.core.env import settings

def get_env_var(var):
    val = getattr(settings, var)
    return str(val) if val else ""

db_user = quote_plus(get_env_var("USER"))
db_password = quote_plus(get_env_var("PASSWORD"))
db_host = get_env_var("HOST")
db_port = get_env_var("PORT")
db_name = get_env_var("DATABASE")

DATABASE_URL = f"postgresql+pg8000://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
# 'pg8000' is solution for doesn't occurs bad translation inside System 

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 'autocommit' make transaction alone, 'autoflush' syncs in database everytime during workflow, bad for network traffic and avoid errors. 
# In our case only me can make transaction with 'db.commit()' 
Base = declarative_base() # Here isn't need parameter 'engine', this will be connect with 'Base.metadata.create_all' later  
# Creates an one bridge to translate code in Python to SQL
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()