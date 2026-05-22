from src.database.connection import engine, Base
from src.database.models import Message

logging.getLogger(__name__)

def ini_db():
    Base.metadata.create_all(bind=engine)
    logger.info("Successful! Table was created.")

if __name__ == "__main__":
    init_db()