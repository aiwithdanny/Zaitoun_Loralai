# Full Integration Test - Step by Step

## Terminal 1: Start Backend

```bash
cd backend
python seed.py
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
✅ Successfully seeded 6 products
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Verify it's running:**
Visit http://localhost:8000/docs in browser → you should see interactive API docs

---

## Terminal 2: Start Frontend

```bash
cd frontend/artifacts/zaitoun-loralai
pnpm run dev
```

Expected output:
```
  VITE v7.3.5  ready in XXX ms
  
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## Browser Testing Flow

### Step 1: Visit Frontend
- Open http://localhost:3000 in browser
- Should see: Hero section, products grid, footer with newsletter

### Step 2: Test Product Loading
- Scroll to "Every Size, One Standard" section
- Should show 6 products with names like:
  - "Extra Virgin Olive Oil - 250ml" ($24.99)
  - "Extra Virgin Olive Oil - 500ml" ($44.99 → $39.99 on sale)
  - etc.
- **Check browser console** (F12 → Console tab):
  - Should NOT show any errors
  - May see: "API unavailable, using mock data" (this is OK on first load)

### Step 3: Add to Cart
- Click "Add" button on any product
- Check:
  - ✅ Toast notification: "Product added to cart"
  - ✅ Cart badge appears in header with count (top right)
  - ✅ Add another product, badge increments

### Step 4: Visit Cart Page
- Click cart icon (top right header)
- Should see:
  - ✅ List of items you added
  - ✅ Quantity +/- buttons work
  - ✅ Remove buttons work
  - ✅ Order summary on right showing total
  - ✅ "Proceed to Checkout" button

### Step 5: Test Checkout
- Click "Proceed to Checkout"
- Fill form:
  - Full Name: "Test User"
  - Email: "test@example.com"
  - Phone: "+1234567890"
  - Address: "123 Main St, Test City"
  - Payment Method: Select "Cash on Delivery"
- Click "Place Order"
- Should see:
  - ✅ Loading spinner briefly
  - ✅ Success page with "Order Confirmed"
  - ✅ Order number displayed (format: LOCAL-TIMESTAMP or ZL-...)
  - ✅ "Back to Home" button

### Step 6: Test Newsletter
- Scroll to footer
- Enter email in newsletter box
- Click arrow button
- Should see:
  - ✅ Toast: "Thank you for subscribing!"
  - ✅ Input clears

### Step 7: Verify Data in Backend

**Check products in database:**
```bash
curl http://localhost:8000/api/v1/products
```
Should return JSON with 6 products

**Check orders:**
```bash
curl http://localhost:8000/api/v1/products
```

**If you need to inspect SQLite database directly:**
```bash
cd backend
python -c "
from src.models.database import SessionLocal
from src.models import Order, NewsletterSubscription, Product
db = SessionLocal()

print('📦 PRODUCTS:', db.query(Product).count())
for p in db.query(Product).all()[:3]:
    print(f'  - {p.name}: \${p.price}')

print('\n📋 ORDERS:', db.query(Order).count())
for o in db.query(Order).all():
    print(f'  - {o.order_number}: {o.customer_email} (\${o.total_amount})')

print('\n📧 NEWSLETTER:', db.query(NewsletterSubscription).count())
for sub in db.query(NewsletterSubscription).filter_by(is_active=True).all():
    print(f'  - {sub.email}')

db.close()
"
```

---

## Troubleshooting

### Frontend shows "Loading products..." forever
- Check backend is running: `curl http://localhost:8000/api/v1/products`
- If backend is down, frontend should auto-fallback to mock data
- Check browser console (F12) for errors

### "CORS error" in browser console
- Verify backend's `.env` has: `FRONTEND_URL=http://localhost:3000`
- Restart backend after changing `.env`

### Products don't show prices
- Seed script may have failed
- Run: `python seed.py` again

### Cart persists after closing browser
- This is correct! Data stored in localStorage
- To clear: Open DevTools (F12) → Application → Local Storage → Clear

### Order not appearing in database
- Check if order succeeded (green toast on checkout success page)
- Run the database inspection script above
- Check backend console for any errors

---

## Success Criteria

✅ All tests pass when you can:
1. Load frontend without errors
2. See 6 products with prices
3. Add items to cart and see badge update
4. Navigate to cart page
5. Fill checkout form and place order
6. See success page with order number
7. Verify order appears in backend database
8. Subscribe to newsletter and see confirmation

---

## What's Actually Happening

**Frontend → Backend Flow:**
1. Frontend loads → tries API at http://localhost:8000/api/v1/products
2. If success: uses real products from database
3. If fails: falls back to mock data (MOCK_PRODUCTS)
4. Add to cart → stored in localStorage (Zustand + persist)
5. Checkout → POST to http://localhost:8000/api/v1/orders
6. If API works: order saved to database + gets real order_number (ZL-...)
7. If API down: order saved to localStorage with LOCAL-timestamp prefix

**Backend Processing:**
1. Receives order POST with customer + items
2. Validates products exist and stock available
3. Decrements product stock
4. Creates Order + OrderItems records
5. Returns order_number to frontend
6. Frontend shows success page

---

## Next After Success

Once all tests pass:
- [ ] Orders are in database ✓
- [ ] Stock decreased for purchased items ✓
- [ ] Newsletter emails stored ✓
- [ ] No console errors ✓

Then you can:
1. Admin panel is built at `/admin/login` — sign in to manage products/orders
2. Add WhatsApp payment integration
3. Deploy to production (Vercel + Railway)

---

## Admin Panel Testing

### Step A: Visit Admin Login
- Open http://localhost:3000/admin/login in browser
- Should see: split-screen layout with login form on left, brand image on right
- Form fields: Username, Password, and "Sign In" button

### Step B: Admin Login
- Use credentials for the registered admin user (or register one-time via API)
- `POST /api/v1/admin/register` with username, email, password (first registration only)
- Fill in admin login form and submit
- Should see:
  - ✅ Toast: "Welcome back, [username]!"
  - ✅ Redirect to `/admin/dashboard`
  - ✅ Sidebar with navigation (Dashboard, Products, Orders, Logout)
  - ✅ Top header showing admin username

### Step C: Dashboard Analytics
- After login, the dashboard should display:
  - ✅ Total products count
  - ✅ Total revenue (from paid orders)
  - ✅ Revenue this month
  - ✅ Order status breakdown chart/table
  - ✅ Low stock products alert
  - ✅ Pending orders count
  - ✅ Orders today count
  - ✅ New customers this month
  - ✅ Top 5 products by revenue

### Step D: Product Management
- Navigate to Products via sidebar
- Should see:
  - ✅ List of all products with name, price, stock, status
  - ✅ "Add Product" button to create new products
  - ✅ Clicking a product opens edit form with:
    - Name, description, short description, price, discount price
    - Stock quantity, category, sort order
    - Image upload (Cloudinary), featured/active toggles
  - ✅ Products can be archived (is_active toggle)

### Step E: Image Upload
- While editing a product, click the image upload area
- Select a JPEG/PNG/WebP image (max 5MB)
- Should see:
  - ✅ Image preview after upload
  - ✅ Cloudinary URL saved to product

### Step F: Order Management
- Navigate to Orders via sidebar
- Should see:
  - ✅ List of all orders with order number, customer, amount, status
  - ✅ Click an order to view details (items, payment info)
  - ✅ Status can be updated (pending → confirmed → processing → shipped → delivered)
  - ✅ Payment status can be updated (unpaid → paid → refunded)

### Step G: Logout
- Click Logout in sidebar footer
- Should see:
  - ✅ Toast: "Logged out successfully"
  - ✅ Redirect to `/admin/login`

---

## Additional Test: Customer Registration & Login

### Step A: Register Customer
- Visit http://localhost:3000/register
- Fill in name, email, phone, password
- Submit → Should see success toast
- Customer is now stored in the `customers` table

### Step B: Customer Login
- Visit http://localhost:3000/login
- Enter email and password
- Submit → Should redirect to home page
- Header should show customer name dropdown instead of Login/Register buttons

### Step C: Place Order While Logged In
- Add items to cart, proceed to checkout
- Order should be linked to the customer account
- Check `/account/orders` to see order history
