"""
Alembic environment configuration for Zaitoun Loralai

Reads DATABASE_URL from the environment variable and uses the
SQLAlchemy models' metadata for autogenerate support.
"""

from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Add backend root to sys.path so models can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Load .env so DATABASE_URL is available without manually setting it
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

# Alembic Config object
config = context.config

# Read DATABASE_URL from environment (not via alembic.ini, to avoid
# configparser % interpolation issues in passwords)
database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise ValueError("DATABASE_URL environment variable is required for Alembic")

# Set up logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import models' metadata for autogenerate support
from src.models import Base  # noqa: E402
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from sqlalchemy import create_engine
    connectable = create_engine(database_url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
