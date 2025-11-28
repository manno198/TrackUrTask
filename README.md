# ProU Employee Task Tracker - Internship Assessment

## Project Overview

This repository contains the complete solution for **ProU Technology Internship Coding Challenge**, implementing both **Track 1 (Frontend)** and **Track 2 (Backend)** as separate, independent projects.

### Track 1: Frontend (Mock Data) [https://prouhs.netlify.app/]
A modern, responsive React Single Page Application (SPA) that manages employee tasks using **mock JSON data only**. The frontend operates independently without any backend API integration, demonstrating component-based architecture, state management, and modern UI/UX practices.

### Track 2: Backend (API + Database)
A fully functional RESTful API built with Node.js and Express.js, providing CRUD operations for Employees and Tasks. The backend uses **SQLite database** with Sequelize ORM, ensuring easy setup without external database dependencies. Includes JWT authentication for protected routes.

---

## 🏗️ Project Structure & Architecture

```
proU-assignment/
├── frontend-track1/          # Track 1: Frontend SPA (React + Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── EmployeeCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── pages/            # Route pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── EmployeeDetail.jsx
│   │   │   └── Tasks.jsx
│   │   ├── data/
│   │   │   └── mockData.js   # Mock JSON data
│   │   ├── hooks/
│   │   │   └── useLocalStorage.js  # Custom hook for persistence
│   │   ├── App.jsx           # Main app component with routing
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles (Tailwind CSS)
│   ├── public/
│   │   └── _redirects        # Netlify redirect rules
│   ├── package.json
│   └── README.md
│
├── backend-track2/           # Track 2: Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # Database configuration (Sequelize)
│   │   ├── models/           # Database models
│   │   │   ├── Employee.js
│   │   │   ├── Task.js
│   │   │   └── index.js      # Model associations
│   │   ├── controllers/      # Business logic
│   │   │   ├── employeeController.js
│   │   │   └── taskController.js
│   │   ├── routes/           # API routes
│   │   │   ├── employeeRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── auth.js       # JWT authentication
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Server entry point
│   ├── postman/
│   │   └── ProU_API_Collection.json  # Postman collection for testing
│   ├── seed.js               # Database seeder script
│   ├── database.sqlite       # SQLite database (auto-created)
│   ├── package.json
│   └── README.md
│
└── README.md                 # This file
```

### Architecture Overview

**Frontend Architecture:**
- **Component-Based**: Modular React components for reusability
- **State Management**: React hooks (useState, useEffect) + custom useLocalStorage hook
- **Routing**: React Router DOM for SPA navigation
- **Styling**: Tailwind CSS for responsive, utility-first styling
- **Data Layer**: Local mock data with localStorage persistence

**Backend Architecture:**
- **MVC Pattern**: Models, Controllers, Routes separation
- **ORM**: Sequelize for database operations
- **Middleware**: Authentication, error handling, logging
- **RESTful API**: Standard HTTP methods and status codes
- **Database**: SQLite (file-based, no external setup needed)

---

## Setup Steps

### Prerequisites
- **Node.js** (v16 or higher)
- **Yarn** or **npm** package manager
- **Git** (for cloning repository)

---

### Frontend Setup (Track 1)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend-track1
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Access the application:**
   - Open browser: `http://localhost:5173`
   - The app will automatically reload on file changes

5. **Build for production (optional):**
   ```bash
   yarn build
   # Output: dist/ folder
   ```

---

### Backend Setup (Track 2)

1. **Navigate to backend directory:**
   ```bash
   cd backend-track2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Seed the database (creates sample data):**
   ```bash
   npm run seed
   ```
   This will:
   - Create SQLite database file (`database.sqlite`)
   - Insert 4 sample employees
   - Insert 8 sample tasks

4. **Start the server:**
   ```bash
   npm run dev    # Development mode with nodemon (auto-restart)
   # or
   npm start      # Production mode
   ```

5. **Server will run on:**
   - **Port**: `5000`
   - **Base URL**: `http://localhost:5000`
   - **API Endpoint**: `http://localhost:5000/api`

6. **Test the API:**
   - Use Postman collection: `backend-track2/postman/ProU_API_Collection.json`
   - Or use curl commands (see API Endpoints section below)

---

## Tech Stack Used

### Frontend (Track 1)
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.21.1
- **Styling**: Tailwind CSS 3.4.0
- **Icons**: Lucide React 0.294.0
- **Font**: Open Sans (Google Fonts)
- **State Management**: React Hooks (useState, useEffect)
- **Persistence**: Browser LocalStorage API

### Backend (Track 2)
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: SQLite 3 (via sqlite3 5.1.6)
- **ORM**: Sequelize 6.35.2
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Validation**: validator.js 13.11.0
- **Security**: bcryptjs 2.4.3 (for password hashing)
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.3.1

### Development Tools
- **Package Manager**: Yarn / npm
- **Code Editor**: VS Code (recommended)
- **API Testing**: Postman
- **Version Control**: Git

---

## API Endpoints (Backend - Track 2)

### Base URL
```
http://localhost:5000/api
```

### Authentication
```
POST   /api/auth/login
Body: { "email": "admin@company.com", "password": "admin123" }
Response: { "success": true, "token": "jwt_token" }
```

### Employees
```
GET    /api/employees              # List all employees
GET    /api/employees/:id          # Get single employee with tasks
POST   /api/employees              # Create employee
PUT    /api/employees/:id          # Update employee
DELETE /api/employees/:id          # Delete employee (and their tasks)
```

### Tasks
```
GET    /api/tasks                  # List all tasks
GET    /api/tasks?status=Pending   # Filter by status
GET    /api/tasks?employeeId=1      # Filter by employee
GET    /api/tasks/:id              # Get single task
POST   /api/tasks                  # Create task (Protected - requires JWT)
PUT    /api/tasks/:id              # Update task (Protected - requires JWT)
DELETE /api/tasks/:id              # Delete task (Protected - requires JWT)
```

### Testing with Postman
1. Import `backend-track2/postman/ProU_API_Collection.json` into Postman
2. Set collection variable `baseUrl` = `http://localhost:5000`
3. Run "Login" request to get token
4. Update `token` variable in collection
5. Test all endpoints

### Testing with cURL
```bash
# Get all employees
curl http://localhost:5000/api/employees

# Get all tasks
curl http://localhost:5000/api/tasks

# Filter tasks by status
curl "http://localhost:5000/api/tasks?status=Pending"

# Create employee
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","role":"Developer","email":"john@company.com"}'
```

---


<img width="1673" height="861" alt="Screenshot 2025-11-28 223759" src="https://github.com/user-attachments/assets/7089dc3a-5f16-41b6-b03d-91c3128c2137" />


### Frontend Screenshots
- **Dashboard Page**: Overview with statistics and recent tasks
- **Employees Page**: Grid view of all employees with task breakdown
- **Tasks Page**: All tasks with filtering options
- **Employee Detail Page**: Individual employee profile with assigned tasks

### Backend Screenshots
- **Postman Collection**: API testing with all endpoints
- **API Response Examples**: JSON responses for different endpoints


---

## Assumptions

1. **Task Assignment**: Each task is assigned to exactly one employee (one-to-many relationship).

2. **Mock Data (Frontend)**: 
   - Frontend uses static mock data stored in `src/data/mockData.js`
   - No API calls are made from the frontend
   - Data persists in browser localStorage after user interactions

3. **Database (Backend)**:
   - SQLite database file is created automatically on first run
   - No external database server setup required
   - Database file (`database.sqlite`) is stored in project root

4. **Authentication**:
   - JWT authentication is implemented for task modification endpoints (POST/PUT/DELETE)
   - GET endpoints are publicly accessible
   - Default login credentials: `admin@company.com` / `admin123`

5. **Task Status**: Limited to three values: `Pending`, `In Progress`, `Completed`

6. **Task Priority**: Optional field with values: `Low`, `Medium`, `High` (default: `Medium`)

7. **Email Uniqueness**: Employee email addresses must be unique across the system

8. **Cascading Deletes**: Deleting an employee automatically deletes all associated tasks

---

## Bonus Features Implemented

### Frontend (Track 1)
- ✅ **LocalStorage Persistence**: Tasks added by users persist after page refresh
- ✅ **Employee Search**: Search employees by name or role
- ✅ **Task Filtering**: Filter tasks by status (All, Pending, In Progress, Completed)
- ✅ **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop
- ✅ **Modern UI**: Custom color palette (coral/green), rounded corners, smooth animations
- ✅ **Dashboard Analytics**: Visual progress bars and task breakdown statistics

### Backend (Track 2)
- ✅ **JWT Authentication**: Secure authentication for protected routes
- ✅ **Request Logging**: Middleware for logging all API requests with status codes
- ✅ **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **Postman Collection**: Complete API collection for easy testing
- ✅ **Database Seeder**: Automated seed script for sample data
- ✅ **SQLite Integration**: No external database setup required

---

## Additional Documentation

- **Frontend README**: `frontend-track1/README.md` - Detailed frontend documentation
- **Backend README**: `backend-track2/README.md` - Detailed backend API documentation
- **Postman Collection**: `backend-track2/postman/ProU_API_Collection.json` - Import into Postman for testing

---

## Deployment

### Frontend Deployment (Netlify)
- **Live Demo**: [https://prouhs.netlify.app/]
- **Build Command**: `yarn build`
- **Publish Directory**: `dist`


---


Build with ❤️ By Harshita Singh
- **Email**: [sharshitaa3@gmail.com]


---

## License

This project is created for ProU Technology Internship Assessment purposes.

---

## 🙏 Acknowledgments

- ProU Technology for the internship opportunity
- React, Express, and open-source community for excellent tools and documentation


