# Hotel Management System
A full-stack restaurant & hotel ops platform for managing menus, tables, orders, and staff approvals through a modern admin dashboard.

## Features
- Secure onboarding with OTP verification, admin-secret gating, and JWT sessions for admins and staff.
- Menu management with image uploads, dual AC/Non-AC pricing, and quick edit/delete flows.
- Table configuration for AC vs Non-AC sections, live occupancy insights, and per-table status lookups.
- Order lifecycle controls: create/update table orders, toggle per-item status, complete sessions, and manage payment state.
- Admin analytics: filterable all-orders view, pending vs delivered item tracking, user roster, and approval queue.
- Robust backend guards with Express middleware, bcrypt hashing, Multer storage, Nodemailer alerts, and environment-based secrets.

## Tech Stack
- React 19, React Router 7, Axios, Tailwind CSS, React Scripts
- Node.js 20+, Express 5, MongoDB + Mongoose
- JWT, bcryptjs, Nodemailer, Multer, dotenv
- Tooling: PostCSS, Autoprefixer, Testing Library, web-vitals

## Installation
1. Clone
   ```bash
   git clone <repo-url>
   cd HotelmanagementSystem
   ```
2. Backend
   ```bash
   cd backend
   npm install
   cp .env.example .env    # fill values below
   ```
3. Frontend
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env    # optional for frontend vars
   ```

### Backend env (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster/db
JWT_SECRET=super-secret-string
ADMIN_SECRET=one-time-admin-code
MAIL_USER=youremail@example.com
MAIL_PASS=app-specific-password
```

## Usage
1. Start API:
   ```bash
   cd backend
   npm start
   ```
2. Start frontend:
   ```bash
   cd ../frontend
   npm start
   ```
3. Visit `http://localhost:3000`, register an admin with the secret key, approve staff, configure tables, add menu items, and manage orders end-to-end.

