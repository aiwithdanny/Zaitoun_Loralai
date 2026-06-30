#!/bin/bash
echo "=========================================="
echo "Zaitoun Loralai - Local Development Setup"
echo "=========================================="
echo ""
echo "STEP 1: Creating database tables..."
python -c "
from src.models.database import engine, Base
Base.metadata.create_all(bind=engine)
print('✅ Database tables created')
"

echo ""
echo "STEP 2: Seeding 6 sample products..."
python seed.py

echo ""
echo "=========================================="
echo "✅ Backend ready!"
echo "=========================================="
echo ""
echo "Starting API server on http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
