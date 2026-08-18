# Track 1: Frontend - Employee Task Tracker

## Overview
A responsive React SPA for managing employees and their tasks, backed by the `backend-track2` REST API. Login is required to access the app; JWT auth gates the protected routes and write actions (create/update/delete) call the API directly.

## Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP client**: Axios (`src/services/api.js`, base URL from `VITE_API_URL`)
- **Icons**: Lucide React
- **Fonts**: Space Grotesk (headings), Inter (body)

## Features
- JWT login (`/login`) with session persisted in `AuthContext`; unauthenticated users are redirected by `ProtectedRoute`
- Dashboard with live stats pulled from `GET /api/stats/dashboard`
- Employee list with search by name/role, employee detail page with task breakdown
- Task list with status filtering, create/update/delete (protected, requires a valid JWT)
- Toast notifications for API success/error feedback
- Responsive design (mobile, tablet, desktop)

## Installation

```bash
# Install dependencies
npm install

# Configure the API URL
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:5173`.

## Pages & Routes

### Login (`/login`)
- Public route; authenticates against `POST /api/auth/login` and stores the returned JWT

### Dashboard (`/`) — protected
- Totals for employees/tasks, breakdown by status and priority, recent tasks, per-employee workload — from `/api/stats/dashboard`

### Employees (`/employees`) — protected
- Grid view of all employees, search by name or role, task breakdown per employee

### Employee Detail (`/employees/:id`) — protected
- Employee info, all assigned tasks, filter by status

### Tasks (`/tasks`) — protected
- All tasks with status filtering
- Create/update/delete require an authenticated session

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx              # Layout wrapper with navbar
│   ├── Navbar.jsx               # Responsive navigation
│   ├── ProtectedRoute.jsx       # Redirects to /login when unauthenticated
│   ├── DashboardCard.jsx        # Stat card for dashboard
│   ├── EmployeeCard.jsx         # Employee info card
│   ├── EmployeeForm.jsx         # Create/edit employee form
│   ├── TaskCard.jsx             # Task display card
│   ├── TaskFilters.jsx          # Status filter buttons
│   ├── TaskForm.jsx             # Create/edit task form
│   ├── TaskList.jsx             # Task grid with filtering
│   ├── Toast.jsx                # Toast notification
│   └── StatusMessage.jsx        # Inline success/error message
├── contexts/
│   ├── AuthContext.jsx          # JWT session state
│   └── ToastContext.jsx         # Toast notification state
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Employees.jsx
│   ├── EmployeeDetail.jsx
│   └── Tasks.jsx
├── services/
│   ├── api.js                   # Axios instance (VITE_API_URL, auth header)
│   ├── authService.js
│   ├── employeeService.js
│   ├── taskService.js
│   └── statsService.js
├── utils/
│   └── jwt.js                   # Token decode/expiry helpers
├── App.jsx                      # Routing + providers
├── main.jsx                     # Entry point
└── index.css                    # Global styles with Tailwind
```

## Design System

### Colors
- **Primary**: Sky blue (#0ea5e9 - primary-500)
- **Success**: Emerald green
- **Warning**: Amber
- **Info**: Blue

### Typography
- **Headings**: Space Grotesk (font-heading)
- **Body**: Inter (font-body)

### Components
- `.btn` / `.btn-primary` / `.btn-secondary` — button styles
- `.card` — white card with shadow and border
- `.input` — form input with focus ring
- `.badge` — small status badge

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` in dev, the deployed EC2 API URL in production |

See `.env.example` (dev) and `.env.production.example` (production build).

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
