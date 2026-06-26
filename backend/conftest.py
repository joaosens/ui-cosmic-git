import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.main import app 
from src.database.connection import Base, get_db 

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}) # Allows more threads work with the same Database without raise error
TestingSessionLocal = sessionmaker(bind=engine) # Where occurs transactions

@pytest.fixture # Infrastructure's to run every time that a test begin
def client():
    Base.metadata.create_all(bind=engine) 

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db # Save in 'test.db' instead save as data in real Database

    with TestClient(app) as c: # Handler who acts upon requests for our tests
        yield c

    app.dependency_overrides.clear() # Deactivates dependency override 

    Base.metadata.drop_all(bind=engine)