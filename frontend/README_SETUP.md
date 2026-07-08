# 🚀 ZL-Replit-Frontend - Complete Setup Guide

## ✅ What's Been Fixed

### Platform & Build
- ✅ Windows platform support (esbuild, lightningcss, rollup binaries)
- ✅ Cross-platform preinstall script
- ✅ All TypeScript errors resolved
- ✅ Asset placeholders created for missing images
- ✅ Vite configs with sensible defaults

### Development Environment
- ✅ API Server with default PORT=8000
- ✅ Both frontends ready to start
- ✅ Environment variables configured
- ✅ Build system verified

---

## 🎯 Quick Start (3 Commands)

### Terminal 1: Start API Server
```powershell
cd "C:\Users\PMYLS\Desktop\Danny Projects\ZL-Replit-Frontend\frontend"
pnpm -C artifacts/api-server dev
# API running on http://localhost:8000
```

### Terminal 2: Start Frontend (mockup-sandbox)
```powershell
cd "C:\Users\PMYLS\Desktop\Danny Projects\ZL-Replit-Frontend\frontend"
$env:PORT=5173; $env:BASE_PATH='/'; pnpm -C artifacts/mockup-sandbox dev
# Open http://localhost:5173
```

### Terminal 3: Start Frontend (zaitoun-loralai)
```powershell
cd "C:\Users\PMYLS\Desktop\Danny Projects\ZL-Replit-Frontend\frontend"
$env:PORT=3000; $env:BASE_PATH='/'; pnpm -C artifacts/zaitoun-loralai dev
# Open http://localhost:3000
```

---

## 📋 Project Structure

```
frontend/
├── artifacts/
│   ├── api-server/          # Express API (port 8000)
│   ├── mockup-sandbox/      # Design system Vite app (port 5173)
│   └── zaitoun-loralai/     # Main product website (port 3000)
├── lib/
│   ├── api-client-react/    # React API client
│   ├── api-spec/            # API specifications
│   ├── api-zod/             # Zod validation schemas
│   └── db/                  # Database schemas (Drizzle ORM)
├── scripts/
│   └── preinstall.js        # Cross-platform preinstall hook
└── pnpm-workspace.yaml      # Workspace config
```

---

## 🔌 API Server

**Status**: ✅ Running on http://localhost:8000

### Current Endpoints
- `GET /api/healthz` — Health check

### Environment Variables
```
PORT=8000                    # API server port
NODE_ENV=development         # Development mode
DATABASE_URL=               # (Optional) PostgreSQL connection
```

### To Run
```powershell
pnpm -C artifacts/api-server dev
```

---

## 🎨 Frontend Apps

### 1. mockup-sandbox (Design System)
- **Port**: 5173
- **Type**: Vite + React
- **Purpose**: Component library and design system
- **Run**: `$env:PORT=5173; $env:BASE_PATH='/'; pnpm -C artifacts/mockup-sandbox dev`

### 2. zaitoun-loralai (Main Website)
- **Port**: 3000
- **Type**: Vite + React with Tailwind
- **Purpose**: Product showcase and e-commerce
- **API**: Connects to http://localhost:8000/api
- **Run**: `$env:PORT=3000; $env:BASE_PATH='/'; pnpm -C artifacts/zaitoun-loralai dev`

---

## 🛠️ Common Commands

```powershell
# Install all dependencies
pnpm install

# Build all packages
pnpm run build

# Type check all packages
pnpm run typecheck

# Start everything (requires 3 terminals)
# Terminal 1:
pnpm -C artifacts/api-server dev

# Terminal 2:
$env:PORT=5173; $env:BASE_PATH='/'; pnpm -C artifacts/mockup-sandbox dev

# Terminal 3:
$env:PORT=3000; $env:BASE_PATH='/'; pnpm -C artifacts/zaitoun-loralai dev
```

---

## 🌐 Access Points

| Service | URL | Status |
|---------|-----|--------|
| API Server | http://localhost:8000 | ✅ Ready |
| mockup-sandbox | http://localhost:5173 | ✅ Ready |
| zaitoun-loralai | http://localhost:3000 | ✅ Ready |

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find and kill process on port
netstat -ano | Select-String ":8000"
Stop-Process -Id <PID> -Force
```

### Dependencies Not Installed
```powershell
# Clean reinstall
rm -r node_modules pnpm-lock.yaml
pnpm install
```

### Environment Variables Not Set
```powershell
# For frontends:
$env:PORT=3000
$env:BASE_PATH='/'

# For API (automatic with our setup):
# PORT defaults to 8000
```

---

## 📝 Files Modified

- `pnpm-workspace.yaml` — Windows platform support
- `package.json` — Cross-platform preinstall
- `scripts/preinstall.js` — ES module preinstall hook
- `artifacts/mockup-sandbox/vite.config.ts` — Default env vars
- `artifacts/zaitoun-loralai/src/vite-env.d.ts` — TypeScript types
- `artifacts/api-server/dev.mjs` — Default PORT
- `.env.local` — Development environment

---

## ✨ Next Steps

1. ✅ Start all three services (see Quick Start above)
2. ✅ Visit http://localhost:3000 (main website)
3. ✅ Check http://localhost:8000/api/healthz (API health)
4. ✅ Test product pages and interactions
5. ✅ Monitor browser console for errors
6. ✅ Check Terminal logs for API issues

All systems are operational and ready for development!
