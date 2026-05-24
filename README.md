📦 Inventory Reservation System (Next.js + PostgreSQL)
🚀 Overview

This project implements a concurrency-safe inventory reservation system for multi-warehouse retail.

It solves the overselling problem caused by slow payment flows (UPI / 3DS / wallet redirects) by introducing a temporary stock reservation mechanism.

🧠 Problem Statement

If stock is reduced only at payment time:

Two users can buy the same last item
One order will fail → bad user experience

If stock is reduced at add-to-cart:

Many abandoned carts incorrectly block inventory
✅ Solution

We reserve stock at checkout for a limited time window and:

Confirm it after payment success
Release it after expiry or cancellation
🗄️ Data Model
Inventory

Tracks stock per product per warehouse:

totalStock
reservedStock

👉 Available stock:

availableStock = totalStock - reservedStock
Reservation
id
productId
warehouseId
quantity
status: pending | confirmed | released
expiresAt
createdAt
🔌 API Endpoints
GET /api/products

Returns products with available stock per warehouse.

GET /api/warehouses

Returns all warehouses.

POST /api/reservations

Creates a reservation.

Logic:
Check available stock
If not enough → 409 Conflict
Else:
Increment reservedStock
Create reservation with expiry time
POST /api/reservations/:id/confirm

Confirms reservation after payment success.

If expired → 410 Gone
Else:
Mark reservation as confirmed
Finalize stock update
POST /api/reservations/:id/release

Releases reservation early.

Marks reservation as released
Decrements reservedStock
⚡ Concurrency Handling

To prevent race conditions:

Database transactions ensure atomicity
Row-level locking is used on inventory updates
Stock updates are performed atomically
Guarantee:

Only one request can reserve the last available unit

If two requests arrive simultaneously:

One succeeds
One receives 409 Conflict
⏳ Reservation Expiry

Reservations expire automatically after expiresAt.

Approach:
Vercel Cron Job runs periodically
Finds expired reservations
Releases them automatically
Restores stock back to inventory
🖥️ Frontend Features
Product Listing Page
Shows products
Warehouse-wise availability
Reserve button
Checkout Page
Reservation details
Countdown timer
Confirm / Cancel actions
UX Handling
409 → Not enough stock
410 → Reservation expired
UI updates dynamically without refresh
🔐 Idempotency (Bonus)

Implemented using Idempotency-Key header:

Prevents duplicate reservation/confirmation requests
Returns same response for repeated requests
🧪 How to Run Locally
npm install
npm run dev
Environment variables:
DATABASE_URL=your_database_url
Migrations:
npx prisma migrate dev
Seed:
npm run seed
🌐 Deployment
Frontend: Vercel
Database: Supabase / Neon PostgreSQL
⚠️ Trade-offs
Cron-based expiry may have slight delay
Redis locking improves safety but adds complexity
Payment flow is simplified (mock implementation)
📌 Key Learnings
Concurrency-safe stock reservation
Transaction-based inventory updates
Designing systems with race condition protection
Proper API error handling (409 / 410)
👨‍💻 Author

Built for Allo Engineering take-home assignment