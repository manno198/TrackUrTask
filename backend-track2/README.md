# Track 2: Backend API - Employee Task Tracker

## Overview
REST API for managing employees and tasks with full CRUD operations, filtering, JWT authentication, and a PostgreSQL database via Sequelize.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM (schema managed by `sequelize-cli` migrations)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt-hashed passwords
- **Validation**: Sequelize model validators + a request-level validation middleware (`src/middleware/validators.js`), both built on `validator.js`
- **Tests**: Node's built-in test runner (`node --test`) + `supertest`, run against a real Postgres test database

## Features
✅ RESTful API architecture
✅ Employee and Task CRUD operations
✅ One-to-Many relationship (Employee has many Tasks)
✅ Filter tasks by status, employee, and priority
✅ Request-level input validation on every write endpoint, plus model-level validation
✅ Standardized `{ success, data|error }` response shape, centralized error handling
✅ Request logging middleware
✅ Real JWT authentication backed by a `User` table and bcrypt password hashing
✅ `GET /health` for load balancer checks
✅ Seed script for sample data
✅ Proper HTTP status codes

## Installation

Requires a local Postgres. The easiest path is Docker:

```bash
# 1. Start Postgres (create a `trackurtask_test` DB too — see below)
docker compose up -d
docker exec trackurtask-postgres psql -U trackurtask -d trackurtask -c "CREATE DATABASE trackurtask_test;"

# 2. Install dependencies
npm install

# 3. Create .env file and fill in DATABASE_URL / JWT_SECRET (see .env.example)
cp .env.example .env

# 4. Create the schema
npm run migrate

# 5. Seed sample data (creates the admin user + demo employees/tasks)
npm run seed

# 6. Start the server
npm start
# or, for development:
npm run dev
```

Without Docker, point `DATABASE_URL`/`DATABASE_URL_TEST` in `.env` at any
Postgres instance you have (local install, another container, RDS) instead
of running `docker compose up -d`; steps 2-6 are unchanged.

## Tests

```bash
npm test
```

Runs against `DATABASE_URL_TEST` (a separate Postgres database from the one
used for `npm run dev`/`npm run seed`) — the test suite drops and recreates
its own tables on each run, so nothing you've seeded locally is affected.

## API Endpoints

### Health
```
GET    /health                     - Liveness/DB connectivity check (for load balancers)
```

### Authentication (Bonus)
```
POST   /api/auth/login
Body: { "email": "admin@company.com", "password": "admin123" }
Response: { "success": true, "token": "jwt_token" }
```

### Employees
```
GET    /api/employees              - List all employees
GET    /api/employees/:id          - Get single employee with tasks
POST   /api/employees              - Create employee (Protected - requires JWT)
PUT    /api/employees/:id          - Update employee (Protected - requires JWT)
DELETE /api/employees/:id          - Delete employee (Protected - requires JWT; also deletes their tasks)
```

### Tasks
```
GET    /api/tasks                  - List all tasks (with employee populated)
GET    /api/tasks?status=Pending   - Filter by status
GET    /api/tasks?employeeId=xxx   - Filter by employee
GET    /api/tasks/:id              - Get single task
POST   /api/tasks                  - Create task (Protected - requires JWT)
PUT    /api/tasks/:id              - Update task (Protected - requires JWT)
DELETE /api/tasks/:id              - Delete task (Protected - requires JWT)
```

### Stats
```
GET    /api/stats/dashboard        - Aggregate counts by status/priority, recent tasks, per-employee workload
```

## Request Examples

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "role": "Software Engineer",
    "email": "john@company.com"
  }'
```

### Create Task (with Authentication)
```bash
# First, login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "password": "admin123"}'

# Use returned token for protected routes
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New feature implementation",
    "description": "Implement user authentication",
    "status": "Pending",
    "priority": "High",
    "employee": "EMPLOYEE_ID_HERE"
  }'
```

### Filter Tasks
```bash
# By status
curl http://localhost:5000/api/tasks?status=Completed

# By employee
curl http://localhost:5000/api/tasks?employeeId=EMPLOYEE_ID

# Both filters
curl "http://localhost:5000/api/tasks?status=In%20Progress&employeeId=EMPLOYEE_ID"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## HTTP Status Codes
- `200` - OK (GET, PUT success)
- `201` - Created (POST success)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Database Models

### Employee
```javascript
{
  name: String (required, 2-100 chars),
  role: String (required, max 100 chars),
  email: String (required, unique, valid email),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Task
```javascript
{
  title: String (required, 3-200 chars),
  description: String (optional, max 1000 chars),
  status: Enum ['Pending', 'In Progress', 'Completed'] (default: 'Pending'),
  priority: Enum ['Low', 'Medium', 'High'] (default: 'Medium'),
  dueDate: Date (optional),
  employee: ObjectId (ref: Employee, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Project Structure
```
backend-track2/
├── src/
│   ├── config/
│   │   ├── database.js              # sequelize-cli config (dev/test/production)
│   │   └── db.js                    # Sequelize instance + connectDB()
│   ├── migrations/                  # Versioned schema migrations (sequelize-cli)
│   ├── models/
│   │   ├── Employee.js              # Employee model
│   │   ├── Task.js                  # Task model
│   │   └── User.js                  # User model (auth)
│   ├── controllers/
│   │   ├── employeeController.js    # Employee business logic
│   │   └── taskController.js        # Task business logic
│   ├── routes/
│   │   ├── employeeRoutes.js        # Employee routes
│   │   └── taskRoutes.js            # Task routes
│   ├── middleware/
│   │   ├── errorHandler.js          # Centralized error handler
│   │   ├── asyncHandler.js          # Wraps async route handlers
│   │   ├── validators.js            # Request-level input validation
│   │   ├── logger.js                # Request logger
│   │   └── auth.js                  # JWT authentication (login + protect)
│   ├── utils/
│   │   └── AppError.js              # statusCode-carrying error class
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
├── tests/                           # node:test + supertest integration tests
├── seed.js                          # Database seeder
├── docker-compose.yml               # Local Postgres for development
├── .sequelizerc
├── package.json
├── .env.example
└── README.md
```

## Testing

Automated: `npm test` (see above). Manual: use curl, Postman, or any API
client — start the server, run `npm run seed` to populate data, then hit
the endpoints documented above (login first for protected routes).

## Notes
- All protected routes (POST/PUT/DELETE tasks, POST/PUT/DELETE employees) require JWT authentication
- Default seeded login credentials: `admin@company.com` / `admin123` (real bcrypt-hashed password in the `users` table, not hardcoded — override via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`)
- Deleting an employee also deletes all their tasks
- Email must be unique for each employee
- Task status must be: Pending, In Progress, or Completed
- Task priority must be: Low, Medium, or High
