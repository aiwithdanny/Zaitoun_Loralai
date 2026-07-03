# Start Zaitoun Full Stack (Backend + Frontend)
# Backend runs on port 8000, Frontend on port 5173

Write-Host "🚀 Starting Zaitoun Full Stack..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing dependencies (if needed)..." -ForegroundColor Yellow
npm run install:all

Write-Host ""
Write-Host "Starting backend and frontend..." -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "🔗 Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "🔗 API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

npm run dev
