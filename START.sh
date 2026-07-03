#!/bin/bash
# Start Zaitoun Full Stack (Backend + Frontend)
# Backend runs on port 8000, Frontend on port 5173

echo "🚀 Starting Zaitoun Full Stack..."
echo ""
echo "Installing dependencies (if needed)..."
npm run install:all

echo ""
echo "Starting backend and frontend..."
echo ""
echo "🔗 Backend: http://localhost:8000"
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run dev
