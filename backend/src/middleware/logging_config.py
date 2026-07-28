"""
Logging and monitoring configuration for Zaitoun Loralai backend
"""

import logging
import logging.handlers
import os
from datetime import datetime


def setup_logging():
    """Configure logging for the FastAPI application"""

    # Create logs directory if it doesn't exist
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Get logger
    logger = logging.getLogger("zaitoun_loralai")
    logger.setLevel(logging.DEBUG if os.getenv("DEBUG") == "True" else logging.INFO)

    # Formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # File handler (rotating logs)
    file_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, "app.log"),
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Error file handler
    error_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, "error.log"),
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    logger.addHandler(error_handler)

    # Console handler for development
    if os.getenv("DEBUG") == "True":
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger


# Initialize logger
logger = setup_logging()


class LoggingMiddleware:
    """Middleware to log all HTTP requests and responses"""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            method = scope.get("method", "")

            # Log incoming request
            logger.info(f"Incoming {method} request to {path}")

            # Track response status
            async def send_wrapper(message):
                if message["type"] == "http.response.start":
                    status = message.get("status", 0)
                    logger.info(f"Response {status} for {method} {path}")
                await send(message)

            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)
