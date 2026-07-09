# 🚀 Zaitoun Full Stack - Quick Start Guide

## One Command to Run Everything

### Windows (PowerShell)
```powershell
.\START.ps1
```

### Mac/Linux (Bash)
```bash
bash START.sh
```

## What This Does

Starts both services in one terminal with labeled output:

- **Backend API**: http://localhost:8000
  - API Docs (Swagger): http://localhost:8000/docs
  - Automatically seeds database with 6 products
  
- **Frontend**: http://localhost:3000
  - React app with Zaitoun e-commerce interface

## First Time Setup

If dependencies aren't installed yet, run:

```powershell
npm run install:all
```

This installs:
- Frontend dependencies (pnpm)
- Backend dependencies (pip)

Then run:

```powershell
.\START.ps1
```

## Individual Commands (if you need to run separately)

**Backend only:**
```powershell
cd backend
python seed.py
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend only:**
```powershell
cd frontend
pnpm -C artifacts/zaitoun-loralai dev
```

## What to Test After Startup

1. **Frontend loads**: Visit http://localhost:3000
2. **API works**: Visit http://localhost:8000/docs
3. **Products show**: Check if 6 items appear on homepage
4. **Add to cart**: Click "Add" on any product
5. **Place order**: Go through checkout flow

See `INTEGRATION_TEST.md` for detailed testing steps.

## Stopping Everything

Press `Ctrl+C` in the terminal — both services stop together.

## Troubleshooting

**"command not found: concurrently"**
- Run: `npm install concurrently --save-dev`

**"CORS error" in browser**
- Verify backend `.env` has: `FRONTEND_URL=http://localhost:3000`
- Restart backend

**Frontend shows "Loading products..."**
- Check backend is running: `curl http://localhost:8000/api/v1/products`
- If backend is down, frontend uses mock data (check console)

**Port 3000 or 8000 already in use**
- Kill process on that port or change in the scripts

---

That's it! One command to run the entire Zaitoun e-commerce platform.
