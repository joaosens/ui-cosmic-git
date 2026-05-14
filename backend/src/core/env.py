import os
import logging
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
try: 
    ENV_PATH =  Path(__file__).resolve().parents[3]/".env"
    # logger.info(f"Environment Path: {ENV_PATH}")
except Exception as e: 
    logger.info(f"Anything was wrong: {e}")

class Settings: 
    TOKEN = os.getenv("TOKEN")

settings = Settings()
