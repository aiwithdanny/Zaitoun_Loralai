# Zaitoun Loralai - Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database

The database is configured to use SQLite locally for development (`zaitoun.db`). Tables auto-create on first run.

### 3. Seed Initial Products

```bash
python seed.py
```

Populates database with 6 sample products matching the frontend.

### 4. Start the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

API available at `http://localhost:8000`

---

## API Endpoints

### Products (Public)
- `GET /api/v1/products` — Get all products (filters: category, featured, search)
- `GET /api/v1/products/{slug}` — Get single product
- `POST /api/v1/products` — Create (Admin + JWT)
- `PUT /api/v1/products/{slug}` — Update (Admin + JWT)
- `DELETE /api/v1/products/{slug}` — Delete (Admin + JWT)

### Orders (Public)
- `POST /api/v1/orders` — Create new order
- `GET /api/v1/orders/{order_number}` — Get order status
- `PUT /api/v1/orders/{order_number}/status` — Update status (Admin + JWT)
- `PUT /api/v1/orders/{order_number}/payment` — Update payment (Admin + JWT)

### Newsletter (Public)
- `POST /api/v1/newsletter/subscribe` — Subscribe email
- `POST /api/v1/newsletter/unsubscribe` — Unsubscribe
- `GET /api/v1/newsletter/subscribers` — Get subscriber count

### Admin
- `POST /api/v1/admin/login` — Login → JWT token
- `POST /api/v1/admin/register` — Register first admin (one-time only)
- `GET /api/v1/admin/profile` — Get profile (requires token)
- `GET /api/v1/admin/stats` — Get stats (requires token)

---

## Authentication

Admin endpoints require JWT Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

**Flow:**
1. Register: `POST /api/v1/admin/register` with username/email/password
2. Login: `POST /api/v1/admin/login` → get `access_token`
3. Use token in Authorization header for admin operations

**Token expires in:** 24 hours

---

## Environment Variables

`.env` file (local development):
```
DATABASE_URL=sqlite:///./zaitoun.db
SECRET_KEY=dev-secret-key-very-insecure-change-in-production
FRONTEND_URL=http://localhost:5173
WHATSAPP_API_TOKEN=test-api-token-dev
WHATSAPP_PHONE_NUMBER_ID=test-phone-id-dev
WEBHOOK_VERIFY_TOKEN=test-webhook-token-dev
```

---

## Database Schema

**Products**
- id, name, slug (unique), description, short_description, price, discount_price, stock, category, image_url, is_active, is_featured, created_at, updated_at

**Orders**
- id, order_number (unique, format: ZL-YYYYMMDDHHMMSS-XXXX), customer_name, customer_email, customer_phone, customer_address, total_amount, status (pending|confirmed|processing|shipped|delivered|cancelled), payment_method (whatsapp|bank_transfer|card|cash), payment_status (unpaid|paid|refunded), whatsapp_message_id, created_at, updated_at

**OrderItems**
- id, order_id (FK), product_id (FK), product_name, product_price, quantity, subtotal, created_at

**NewsletterSubscriptions**
- id, email (unique), subscribed_at, unsubscribed_at, is_active

**AdminUsers**
- id, username (unique), email (unique), password_hash, is_active, is_admin, created_at, last_login

---

## Testing Endpoints

**Get Products:**
```bash
curl http://localhost:8000/api/v1/products
```

**Create Order:**
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Ahmed Khan",
    "customer_email": "ahmed@example.com",
    "customer_phone": "+923331234567",
    "customer_address": "123 Main St, Loralai",
    "items": [{"product_id": 1, "quantity": 2}],
    "payment_method": "cash"
  }'
```

**Subscribe Newsletter:**
```bash
curl -X POST http://localhost:8000/api/v1/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

---

## Next Steps

1. ✅ Backend API complete with all endpoints
2. Run frontend: `pnpm run dev` in `frontend/artifacts/zaitoun-loralai/`
3. Test full flow: Add to cart → Checkout → Place order
4. Verify orders appear in database
5. Build admin panel (future)

