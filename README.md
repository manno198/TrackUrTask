# TrackUrTask — Employee Task Tracker

A full-stack employee task tracking app: React/Vite frontend, Node/Express REST API, PostgreSQL database, JWT authentication — built and deployed end-to-end on AWS.

**Live:** [Frontend](http://trackurtask-frontend-903797724213.s3-website.ap-south-1.amazonaws.com) · [API Health Check](http://3.108.249.124/health) · Demo login is shown directly on the sign-in page

**Note on Frontend URL:** Deployed via S3 static website hosting over HTTP for this demo evaluation. If your browser blocks mixed content or forces HTTPS, you can view the local setup instructions below or check the API health check directly. Demo credentials are clearly shown on the sign-in page.

---

## Skills Demonstrated

**React.js (Frontend)** — Full single-page app built with React 18 + Vite: React Router for navigation, Context API for auth/session state, protected routes, and a real Axios-based API client (not mock data). Styled with Tailwind CSS.

**Node.js (Backend/API)** — REST API built with Express + Sequelize on PostgreSQL: JWT authentication, request validation, error handling, versioned database migrations, and automated tests (Node's built-in test runner + Supertest).

**AWS (Deployment)** — Actually deployed and running, not just configured on paper: EC2 (Nginx + PM2-managed Node process), RDS PostgreSQL, and S3, wired together and secured via the AWS CLI (security groups, IAM, static site hosting).

---

## AWS Deployment

**S3 + EC2 + RDS — deployed and live** in `ap-south-1` (Mumbai):

```
S3 (React frontend)  →  EC2 + Nginx + PM2 (Node/Express API)  →  RDS (PostgreSQL)
```

- **S3** serves the built React app as a static website
- **EC2** runs the Node/Express API under PM2, behind an Nginx reverse proxy
- **RDS** is a managed PostgreSQL instance, not publicly accessible — only the EC2 instance can reach it

Full architecture notes, security-group details, and known trade-offs of this setup are in [Deployment Details](#deployment-details) further down.

---

## Overview

TrackUrTask lets a team manage employees and the tasks assigned to them: create/update/delete employees, assign and track tasks by status and priority, and view aggregate workload/dashboard statistics. Read access to employee and task listings is public; creating, updating, and deleting tasks and employees requires an authenticated (JWT) session.

---

## Project Structure

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

## Deployment Details

<details>
<summary>Full architecture, security-group setup, and production trade-offs (click to expand)</summary>

### Architecture

```
                 ┌───────────────────────────┐
   Browser  ───▶ │ S3 Static Website Hosting  │  React production build (frontend-track1/dist)
                 └──────────┬─────────────────┘
                            │  HTTP (VITE_API_URL)
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

### Frontend & Backend internals

- **Frontend**: React 18 + Vite 5, React Router for client-side routing, Tailwind CSS. `AuthContext` holds the JWT and gates the app behind `ProtectedRoute`; `/login` is the only public route. API calls go through a single Axios instance (`src/services/api.js`) whose base URL is `VITE_API_URL`.
- **Backend**: Express REST API, MVC-style (routes → controllers → Sequelize models). PostgreSQL via Sequelize ORM, schema managed by Sequelize CLI migrations (no `sync()` in production). JWT authentication: `POST /api/auth/login` issues a token; `protect` middleware guards writes. CORS is allow-listed from `FRONTEND_URL` / `CORS_ORIGINS` env vars — never wildcards. `/health` reports API + database connectivity.

### Security notes & known trade-offs

- Passwords hashed with bcrypt; JWTs signed with a required, non-default `JWT_SECRET`.
- Write endpoints (create/update/delete) require a valid JWT via the `protect` middleware, with server-side input validation on every write.
- All secrets (`DATABASE_URL`, `JWT_SECRET`, seed admin credentials) are supplied via environment variables, never committed — `.env` is gitignored, only `.env.example` placeholders are tracked.
- RDS is not publicly accessible; its security group only trusts the EC2 instance's security group on port 5432.
- `/health` avoids leaking internal error details; only reports `ok`/`error` + DB connectivity.
- **Interim trade-off:** the frontend is currently served via S3 static website hosting over plain HTTP with a public bucket (S3 website endpoints have no auth mechanism). That's an acceptable trade-off for this demo deployment (seed data only, no real user data) but not how this would be set up for an app handling real user data — the next step would be putting a CDN with HTTPS and a private, access-controlled origin bucket in front of it.
- Demo admin login is intentionally shown on the deployed sign-in page for reviewer convenience — again, only appropriate because this is seed/demo data.

</details>

---

## Tech Stack

**Frontend:** React 18, Vite 5, React Router 6, Tailwind CSS, Axios
**Backend:** Node.js, Express 4, Sequelize 6, PostgreSQL (`pg`), jsonwebtoken, bcryptjs, validator.js
**Testing:** Node's built-in test runner + Supertest
**Process management:** PM2 (`ecosystem.config.js`)
**Local dev database:** Docker Compose (Postgres 16)
