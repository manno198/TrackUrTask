# Postman Collection Setup Guide

## Quick Setup

1. **Open Postman** (download from https://www.postman.com/downloads/)

2. **Create Collection**:
   - Click "Collections" → "+" → Name: "TrackUrTask Task Tracker API"

3. **Set Base URL Variable**:
   - Right-click collection → "Edit" → "Variables" tab
   - Add: `baseUrl` = `http://localhost:5000`

4. **Add All Endpoints** (see below)

5. **Export Collection**:
   - Right-click collection → "Export" → "Collection v2.1"
   - Save as: `TrackUrTask_API_Collection.json` in this folder

## Endpoints to Add

### Auth
- **POST** `{{baseUrl}}/api/auth/login`
  - Body: `{ "email": "admin@company.com", "password": "admin123" }`
  - Copy the `token` from response and add as collection variable `token`

### Employees
- **GET** `{{baseUrl}}/api/employees` - Get all employees
- **GET** `{{baseUrl}}/api/employees/:id` - Get employee by ID
- **POST** `{{baseUrl}}/api/employees` - Create employee
  - Body: `{ "name": "John Doe", "role": "DevOps", "email": "john@company.com" }`
- **PUT** `{{baseUrl}}/api/employees/:id` - Update employee
  - Body: `{ "role": "Senior DevOps" }`
- **DELETE** `{{baseUrl}}/api/employees/:id` - Delete employee

### Tasks
- **GET** `{{baseUrl}}/api/tasks` - Get all tasks
- **GET** `{{baseUrl}}/api/tasks?status=Pending` - Filter by status
- **GET** `{{baseUrl}}/api/tasks?employeeId=1` - Filter by employee
- **GET** `{{baseUrl}}/api/tasks/:id` - Get task by ID
- **POST** `{{baseUrl}}/api/tasks` - Create task (Protected)
  - Headers: `Authorization: Bearer {{token}}`
  - Body: `{ "title": "New task", "status": "Pending", "employeeId": 1 }`
- **PUT** `{{baseUrl}}/api/tasks/:id` - Update task (Protected)
  - Headers: `Authorization: Bearer {{token}}`
  - Body: `{ "status": "Completed" }`
- **DELETE** `{{baseUrl}}/api/tasks/:id` - Delete task (Protected)
  - Headers: `Authorization: Bearer {{token}}`

## Notes

- Replace `:id` with actual IDs (e.g., `/api/employees/1`)
- For protected routes, first run Login to get token
- Add token as collection variable `{{token}}` for easy reuse

