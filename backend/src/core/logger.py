import logging
from pathlib import Path
from datetime import datetime, timezone
from dataclasses import dataclass 

@dataclass
class Logs:
    log_dir: str = None
    level: str = "INFO"
    log_format: str = None
    def setup_log(self) -> Path:
        if self.log_dir is None:
            folder = log_dir = Path(__file__).resolve().parents[3]/"logs"
        else: 
            folder = Path(log_dir)
        folder.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        log_filename = folder / f"{timestamp}.log"
        
        numeric_level = getattr(logging, self.level.upper(), logging.INFO)

        if self.log_format is None:
            self.log_format = "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
        
        logging.basicConfig(level=numeric_level, 
        format=self.log_format, 
        handlers=[logging.FileHandler(log_filename), 
        logging.StreamHandler()])

        logger = logging.getLogger(__name__)
        logger.info("System Log Active")
        logger.info(f"Logs will be saved at: {folder}")
        logger.info(f"LEVEL LOG: {numeric_level} - {self.level}")

        return folder


