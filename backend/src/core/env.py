import os
import logging
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(encoding="utf-8")
logger = logging.getLogger(__name__)
try: 
    ENV_PATH =  Path(__file__).resolve().parents[3]/".env"
    # logger.info(f"Environment Path: {ENV_PATH}")
except Exception as e: 
    logger.info(f"Anything was wrong: {e}")

class Settings: 
    # Load env variables explicitly with a fallback to avoid NoneType
    TOKEN = os.getenv("TOKEN", "")
    SECRET_KEY = os.getenv("SECRET_KEY", "")
    ALGORITHM = os.getenv("ALGORITHM", "")
    USER = os.getenv("USER", "")
    PASSWORD = os.getenv("PASSWORD", "")
    HOST = os.getenv("HOST", "")
    PORT = os.getenv("PORT", "")
    DATABASE = os.getenv("DATABASE", "")
    ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", ""))
    ACCESS_TOKEN_MERCADOPAGO = os.getenv("ACCESS_TOKEN_MERCADOPAGO", "")


settings = Settings()

