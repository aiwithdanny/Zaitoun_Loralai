# Zaitoun Loralai Backend API

FastAPI backend for olive oil e-commerce with WhatsApp payments | Python 3.8+ | MySQL

## Quick Start

```bash
cd backend && python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt && cp .env.example .env  # Configure DATABASE_URL
python src/db/migrate.py && uvicorn src.main:app --reload  # Setup + Start
```

**API Docs:** [Swagger UI](http://localhost:8000/docs) | [ReDoc](http://localhost:8000/redoc)

## Tech Stack

FastAPI 0.115.0 | SQLAlchemy 2.0 | MySQL (PlanetScale) | Uvicorn | JWT (python-jose) | WhatsApp Business API

---

## API Endpoints

**Products** `/api/v1/products/` — GET `/` (list, filters: category/featured/active), GET `/{slug}` (detail), POST `/` (create, admin), PUT `/{slug}` (update, admin), DELETE `/{slug}` (delete, admin)

**Orders** `/api/v1/orders/` — POST `/` (create: customer_name, email, phone, address, items[]), GET `/{order_number}` (details), PUT `/{order_number}/status` (update status, admin), PUT `/{order_number}/payment` (update payment, admin)

**WhatsApp** `/api/v1/whatsapp/` — POST `/send-message` (to, message), POST `/payment-link` (order_number, amount), POST `/webhook` (verified with X-Hub-Signature-256), GET `/template` (payment template)

**Admin** `/api/v1/admin/` — POST `/login` (username, password → JWT token), POST `/register` (username, email, password), GET `/stats` (dashboard, requires auth), GET `/profile` (current admin profile, requires auth)

**Customers** `/api/v1/customers/` — POST `/register` (name, email, phone, password), POST `/login` (email, password → JWT), GET `/me` (profile, requires customer token), GET `/me/orders` (order history, requires customer token)

**Newsletter** `/api/v1/newsletter/` — POST `/subscribe` (email), POST `/unsubscribe` (email), GET `/subscribers` (total active count)

**Upload** `/api/v1/products/` — POST `/upload-image` (multipart file, admin, returns Cloudinary URL)

**Auth:** Protected endpoints require: `Authorization: Bearer <jwt_token>`

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql+pymysql://user:pass@host:3306/db` |
| `FRONTEND_URL` | Frontend domain (CORS) | `http://localhost:3000` or `https://app.vercel.app` |
| `WHATSAPP_API_TOKEN` | Meta Business API token | `EAAxxxxx...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta phone number ID | `1234567890` |
| `SECRET_KEY` | JWT signing key | Random 64-char string |
| `WEBHOOK_VERIFY_TOKEN` | Meta webhook verification | Random string |
| `DEBUG` | Enable debug mode | `True` (dev) / `False` (prod) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

**Setup:** Copy `.env.example` → `.env` and fill in values

---

## Database Schema

### `products`
```sql
id (PK), name, slug (unique), description, short_description, price (decimal), discount_price (decimal), 
stock (int), category, sort_order (int), image_url, is_active (bool), is_featured (bool), 
created_at, updated_at
```

### `orders`
```sql
id (PK), order_number (unique, auto), customer_name, customer_email, 
customer_phone, customer_address, total_amount (decimal), 
status (pending/confirmed/processing/shipped/delivered/cancelled), 
payment_method, payment_status (pending/paid/failed), 
whatsapp_message_id, customer_id (FK → customers.id, nullable),
created_at, updated_at
```

### `order_items`
```sql
id (PK), order_id (FK), product_id (FK), product_name, 
product_price (decimal), quantity, subtotal (decimal)
```

### `admin_users`
```sql
id (PK), username (unique), email (unique), password_hash (bcrypt), 
is_active (bool), is_admin (bool), created_at, last_login
```

### `customers`
```sql
id (PK), name, email (unique), phone, password_hash (bcrypt), 
is_active (bool), created_at, last_login
```

### `newsletter_subscriptions`
```sql
id (PK), email (unique), subscribed_at, unsubscribed_at, is_active (bool)
```

**Migrations:** Run `python src/db/migrate.py` to create/update tables

---

## Common Commands

```bash
# Development
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Database
python src/db/migrate.py                    # Create tables
python -c "from src.models import *; ..."   # Query ORM models

# Testing
curl http://localhost:8000/health           # Health check
curl http://localhost:8000/api/v1/products/ # List products

# Production (Render)
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

---

## Project Structure

```
backend/
├── src/
│   ├── main.py              FastAPI app setup, CORS, routes
│   ├── api/v1/              API endpoints (products, orders, whatsapp, admin, newsletter, customers, upload)
│   ├── models/              SQLAlchemy models (Product, Order, OrderItem, AdminUser, Customer, NewsletterSubscription)
│   ├── config/              Configuration (database.py, auth.py, cloudinary.py)
│   ├── schemas.py           Pydantic request/response schemas
│   ├── exceptions.py        Custom exception classes and handlers
│   └── db/                  Database utilities (migrate.py)
├── tests/                   Pytest test suite
├── requirements.txt         Python dependencies
├── .env.example             Environment template
├── Procfile                 Render deployment config
└── README.md                This file
```

---

## Security Features

- ✅ JWT authentication with bcrypt password hashing
- ✅ CORS restricted to frontend domain only
- ✅ WhatsApp webhook signature verification (HMAC-SHA256)
- ✅ Input validation via Pydantic models
- ✅ SQL injection protection via SQLAlchemy ORM
- ⚠️ Rate limiting (TODO)
- ⚠️ HTTPS enforcement (production only)

---

## Deployment

**Render:** Connect GitHub repo → Set environment variables → Deploy  
**Database:** PlanetScale MySQL (or any MySQL 8.0+ instance)  
**Health Check:** `GET /health` returns `{"status": "healthy"}`

See [CLAUDE.md](../CLAUDE.md) for full deployment checklist
