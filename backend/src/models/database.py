"""
Database configuration — supports PostgreSQL (primary), MySQL, and SQLite (local dev/tests)
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Database URL from environment (e.g. postgresql://..., mysql+pymysql://..., sqlite:///...)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Get database session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

