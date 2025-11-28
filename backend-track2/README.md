# Track 2: Backend API - Employee Task Tracker

## Overview
REST API for managing employees and tasks with full CRUD operations, filtering, authentication, and MongoDB integration.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Sequelize validators + validator.js

## Features
✅ RESTful API architecture
✅ Employee and Task CRUD operations
✅ One-to-Many relationship (Employee has many Tasks)
✅ Filter tasks by status and employee
✅ Input validation and error handling
✅ Request logging middleware
✅ JWT authentication (bonus)
✅ Seed script for sample data
✅ Proper HTTP status codes

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env file (optional - SQLite works without .env)
# PORT=5000
# JWT_SECRET=your_secret_key

# Seed database with sample data
npm run seed

# Start server
npm start

# Or use nodemon for development
npm run dev
```

## API Endpoints

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
POST   /api/employees              - Create employee
PUT    /api/employees/:id          - Update employee
DELETE /api/employees/:id          - Delete employee (and their tasks)
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
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── Employee.js              # Employee model
│   │   └── Task.js                  # Task model
│   ├── controllers/
│   │   ├── employeeController.js    # Employee business logic
│   │   └── taskController.js        # Task business logic
│   ├── routes/
│   │   ├── employeeRoutes.js        # Employee routes
│   │   └── taskRoutes.js            # Task routes
│   ├── middleware/
│   │   ├── errorHandler.js          # Global error handler
│   │   ├── logger.js                # Request logger
│   │   └── auth.js                  # JWT authentication
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
├── seed.js                          # Database seeder
├── package.json
├── .env.example
└── README.md
```

## Testing

Test using curl, Postman, or any API client:

1. Start the server
2. Run seed script to populate data
3. Test endpoints with sample requests above
4. For protected routes, first login to get JWT token

## Notes
- All protected routes (POST/PUT/DELETE tasks) require JWT authentication
- Login credentials: `admin@company.com` / `admin123`
- Deleting an employee also deletes all their tasks
- Email must be unique for each employee
- Task status must be: Pending, In Progress, or Completed
- Task priority must be: Low, Medium, or High
