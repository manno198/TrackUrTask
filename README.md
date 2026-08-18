# TrackUrTask — Employee Task Tracker

A full-stack employee task tracking application: a React/Vite single-page frontend backed by a Node/Express REST API with PostgreSQL persistence and JWT authentication.

---

## Live Demo

**Frontend:** http://trackurtask-frontend-903797724213.s3-website.ap-south-1.amazonaws.com
**Backend health check:** http://3.108.249.124/health

Demo admin login is shown directly on the app's sign-in page (also documented under [Security Considerations](#security-considerations) below).

---

## Overview

TrackUrTask lets a team manage employees and the tasks assigned to them: create/update/delete employees, assign and track tasks by status and priority, and view aggregate workload/dashboard statistics. Read access to employee and task listings is public; creating, updating, and deleting tasks and employees requires an authenticated (JWT) session.

---

## Architecture

```
TrackUrTask/
├── frontend-track1/        React + Vite SPA
│   └── src/
│       ├── components/     UI components (cards, forms, layout, toasts, protected route)
│       ├── contexts/       AuthContext (JWT session), ToastContext (notifications)
│       ├── pages/          Login, Dashboard, Employees, EmployeeDetail, Tasks
│       ├── services/       Axios API client (VITE_API_URL)
│       └── utils/
│
└── backend-track2/         Node + Express REST API
    ├── src/
    │   ├── app.js           Express app: middleware, CORS, routes, /health
    │   ├── server.js        Entry point
    │   ├── config/          Sequelize config (database.js) + connection (db.js)
    │   ├── models/          Employee, Task, User (Sequelize)
    │   ├── migrations/      Sequelize CLI migrations (employees, users, tasks)
    │   ├── controllers/     employee, task, stats
    │   ├── routes/          employeeRoutes, taskRoutes, statsRoutes
    │   ├── middleware/      auth (JWT), validators, errorHandler, asyncHandler, logger
    │   └── utils/           AppError
    ├── tests/               node:test + supertest integration tests
    ├── seed.js              Seeds an admin user, employees, and tasks
    ├── ecosystem.config.js  PM2 process configuration
    └── docker-compose.yml   Local Postgres for development
```

**Frontend**
- React 18 + Vite 5, React Router for client-side routing
- Tailwind CSS for styling
- `AuthContext` holds the JWT and gates the app behind `ProtectedRoute`; `/login` is the only public route
- API calls go through a single Axios instance (`src/services/api.js`) whose base URL is `VITE_API_URL`

**Backend**
- Express REST API, MVC-style (routes → controllers → Sequelize models)
- PostgreSQL via Sequelize ORM, schema managed by Sequelize CLI migrations (no `sync()` in production)
- JWT authentication: `POST /api/auth/login` issues a token; `protect` middleware guards writes
- CORS is allow-listed from `FRONTEND_URL` / `CORS_ORIGINS` env vars — never wildcards
- `/health` reports API + database connectivity for load balancer health checks

---

## API

Base path: `/api`

### Auth
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | `{ email, password }` → `{ token }` |

### Employees
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/employees` | Public | List employees |
| GET | `/api/employees/:id` | Public | Employee with tasks |
| POST | `/api/employees` | JWT | Create employee |
| PUT | `/api/employees/:id` | JWT | Update employee |
| DELETE | `/api/employees/:id` | JWT | Delete employee (cascades to their tasks) |

### Tasks
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/tasks` | Public | List tasks (`?status=`, `?employeeId=`) |
| GET | `/api/tasks/:id` | Public | Single task |
| POST | `/api/tasks` | JWT | Create task |
| PUT | `/api/tasks/:id` | JWT | Update task |
| DELETE | `/api/tasks/:id` | JWT | Delete task |

### Stats
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/stats/dashboard` | Public | Totals by status/priority, recent tasks, per-employee workload |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/health` | `{ status, db }` — checks the database connection; used for infra health checks |

Task `status` ∈ `Pending | In Progress | Completed`. Task `priority` ∈ `Low | Medium | High` (default `Medium`).

A Postman collection is available at `backend-track2/postman/ProU_API_Collection.json`.

---

## Local Setup

### Prerequisites
- Node.js 18+
- Docker (for local PostgreSQL) — or a PostgreSQL instance of your own

### 1. Database (local dev)
```bash
cd backend-track2
docker compose up -d      # starts Postgres on localhost:5434
```

### 2. Backend
```bash
cd backend-track2
npm install
cp .env.example .env      # then edit values as needed
npm run migrate           # create schema
npm run seed               # create admin user + sample employees/tasks
npm run dev                 # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend-track1
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

### Tests
```bash
cd backend-track2
npm test                   # requires DATABASE_URL_TEST / a running Postgres
```

---

## Environment Variables

### Backend (`backend-track2/.env`, see `.env.example`)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `DATABASE_URL_TEST` | Postgres connection string used by `npm test` |
| `DB_SSL` | `true` to enable TLS (required for RDS) |
| `PORT` | API listen port |
| `JWT_SECRET` | JWT signing secret — required, no default; generate a long random value |
| `FRONTEND_URL` | Deployed frontend origin, primary allowed CORS origin |
| `CORS_ORIGINS` | Extra comma-separated allowed origins |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials created by `npm run seed` |

### Frontend (`frontend-track1/.env` / `.env.production`, see `.env.example` / `.env.production.example`)
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API the built frontend calls |

`.env` files are gitignored everywhere; only `.env.example` / `.env.production.example` placeholder files are committed.

---

## Database Migrations & Seeding

Schema is managed by Sequelize CLI migrations under `backend-track2/src/migrations` (never `sequelize.sync()` against production):

```bash
npm run migrate        # apply all pending migrations
npm run migrate:undo    # roll back the last migration
npm run seed             # wipe and repopulate with an admin user + sample data
```

Change `SEED_ADMIN_PASSWORD` from its default before seeding any non-local environment.

---

## Production Deployment Architecture

### Current (live): S3 → EC2 → RDS

Deployed on AWS (`ap-south-1` / Mumbai):

```
                 ┌───────────────────────────┐
   Browser  ───▶ │ S3 Static Website Hosting  │  React production build (frontend-track1/dist)
                 └──────────┬─────────────────┘
                            │  HTTP (VITE_API_URL — see note below)
                            ▼
                 ┌───────────────────────────┐
                 │ EC2 + Nginx reverse proxy  │  proxies :80 → Express on :5000
                 │ (PM2-managed API process)  │
                 └──────────┬─────────────────┘
                            │
                            ▼
                 ┌───────────────────────────┐
                 │ RDS PostgreSQL              │  DB_SSL=true, security group restricted
                 │                              │  to the EC2 instance only (never public)
                 └───────────────────────────┘
```

- **S3** hosts the Vite production build as a public static website (bucket: `trackurtask-frontend-903797724213`); `VITE_API_URL` is baked in at build time to point at the EC2 API.
- **EC2** runs the Express API under **PM2** (`pm2 start ecosystem.config.js`) behind an **Nginx** reverse proxy on port 80 → `localhost:5000`; configuration comes entirely from environment variables (never hardcoded). Port 5000 is not exposed to the internet — only Nginx on 80 is.
- **RDS PostgreSQL** is the production database, reached over `DATABASE_URL` with `DB_SSL=true`. Its security group only allows inbound traffic from the EC2 instance's security group — never `0.0.0.0/0`.

### Planned: CloudFront + S3 → EC2 → RDS

The target design fronts S3 (private, via Origin Access Control) and the EC2 API with a single CloudFront distribution as the HTTPS entry point, replacing the current plain-HTTP S3 website hosting. **Not deployed yet** — CloudFront distribution creation is currently blocked on this AWS account pending AWS's own account verification process. This is a temporary AWS-side restriction, not an architectural choice; the switch-over requires no application code changes, only AWS-side reconfiguration.

---

## Security Considerations

- Passwords hashed with bcrypt; JWTs signed with a required, non-default `JWT_SECRET`.
- CORS is an explicit allow-list (`FRONTEND_URL` + `CORS_ORIGINS`); it never falls back to `*`.
- Write endpoints (create/update/delete) require a valid JWT via the `protect` middleware.
- All secrets (`DATABASE_URL`, `JWT_SECRET`, seed admin credentials) are supplied via environment variables, never committed — `.env` is gitignored and only `.env.example` placeholders are tracked.
- Server-side input validation on all write endpoints (`src/middleware/validators.js`).
- `/health` avoids leaking internal error details; only reports `ok`/`error` + DB connectivity.
- RDS is not publicly accessible; its security group only trusts the EC2 instance's security group on port 5432.
- **Interim deployment trade-off:** the current S3 static-website hosting setup (see architecture above) serves the frontend over plain HTTP with a public bucket, since it's a stopgap for a CloudFront-blocked AWS account. Its own JS bundle intentionally publishes demo admin credentials on the sign-in page for reviewer convenience — this is only appropriate for a demo deployment seeded with sample data, never for an app holding real user data.
- **Demo login:** shown directly on the deployed sign-in page — this is seed data for demo/review purposes only.
- In production (once CloudFront/HTTPS is in place), terminate TLS in front of the API as well and keep `DB_SSL=true` for encrypted connections to RDS.

---

## Tech Stack

**Frontend:** React 18, Vite 5, React Router 6, Tailwind CSS, Axios
**Backend:** Node.js, Express 4, Sequelize 6, PostgreSQL (`pg`), jsonwebtoken, bcryptjs, validator.js
**Testing:** Node's built-in test runner + Supertest
**Process management:** PM2 (`ecosystem.config.js`)
**Local dev database:** Docker Compose (Postgres 16)
