# Track 1: Frontend - Employee Task Tracker

## Overview
A modern, responsive React application for managing employee tasks with filtering, search, and local storage persistence. Built with **mock data only** - no backend integration.

## Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Fonts**: Space Grotesk (headings), Inter (body)

## Features
✅ View list of employees and their tasks
✅ Filter tasks by status (Pending / In Progress / Completed)
✅ Add new tasks (frontend-only, updates state)
✅ Dashboard with statistics and analytics
✅ Search employees by name or role
✅ Employee detail page with task filtering
✅ Responsive design (mobile, tablet, desktop)
✅ LocalStorage persistence (bonus)
✅ Modern UI with hover effects and animations

## Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

The app will run on `http://localhost:5173`

## Pages & Routes

### Dashboard (`/`)
- Total employees count
- Total tasks count
- Completed tasks with percentage
- In Progress tasks count
- Pending tasks count
- Progress bar visualization
- Recent tasks list

### Employees (`/employees`)
- Grid view of all employees
- Search by name or role
- Employee cards showing:
  - Name and role
  - Total tasks
  - Task breakdown (completed, in progress, pending)
- Click employee to view details

### Employee Detail (`/employees/:id`)
- Individual employee information
- All tasks assigned to that employee
- Filter tasks by status
- Back navigation

### Tasks (`/tasks`)
- All tasks from all employees in one view
- Filter by status (All / Pending / In Progress / Completed)
- Add new task button (opens modal)
- Task cards showing:
  - Task title
  - Status badge with color coding
  - Assigned employee name

## Mock Data Structure

Data is stored in `/src/data/mockData.js`:

```javascript
{
  employees: [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Frontend Developer",
      tasks: [
        { id: 101, title: "Build login page", status: "Completed" },
        { id: 102, title: "Implement dashboard", status: "In Progress" }
      ]
    },
    // ... more employees
  ]
}
```

## Component Structure

```
src/
├── components/
│   ├── Layout.jsx              # Main layout wrapper with navbar
│   ├── Navbar.jsx              # Navigation bar (responsive)
│   ├── DashboardCard.jsx       # Stat card for dashboard
│   ├── EmployeeCard.jsx        # Employee info card
│   ├── TaskCard.jsx            # Task display card
│   ├── TaskFilters.jsx         # Status filter buttons
│   ├── TaskForm.jsx            # Modal form for adding tasks
│   └── TaskList.jsx            # Task grid with filtering
├── pages/
│   ├── Dashboard.jsx           # Home page with stats
│   ├── Employees.jsx           # Employee list page
│   ├── EmployeeDetail.jsx      # Single employee page
│   └── Tasks.jsx               # All tasks page
├── data/
│   └── mockData.js             # Mock employee and task data
├── hooks/
│   └── useLocalStorage.js      # Custom hook for persistence
├── App.jsx                     # Main app with routing
├── main.jsx                    # Entry point
└── index.css                   # Global styles with Tailwind
```

## Features in Detail

### 1. Task Status Colors
- **Completed**: Green (emerald-100/800)
- **In Progress**: Blue (blue-100/800)
- **Pending**: Yellow/Orange (amber-100/800)

### 2. Add Task Functionality
- Opens modal form
- Fields:
  - Task title (required)
  - Assign to employee (dropdown)
  - Status (dropdown)
- Validation: title required, employee required
- Generates unique task ID using `Date.now()`
- Updates state and localStorage

### 3. LocalStorage Persistence (Bonus)
- Custom `useLocalStorage` hook
- Saves employee data to browser storage
- Data persists after page refresh
- Key: `'employeeData'`

### 4. Responsive Design
- **Mobile**: Single column, hamburger menu
- **Tablet**: 2 columns for cards
- **Desktop**: 3-4 columns for cards
- Breakpoints: `sm:` 640px, `md:` 768px, `lg:` 1024px

### 5. UI/UX Features
- Smooth transitions (200ms duration)
- Hover effects on cards (scale, shadow)
- Gradient backgrounds on stat cards
- Color-coded status badges with icons
- Empty states with friendly messages
- Progress bar animation
- Modal slide-in animation

## Design System

### Colors
- **Primary**: Sky blue (#0ea5e9 - primary-500)
- **Success**: Emerald green
- **Warning**: Amber
- **Info**: Blue

### Typography
- **Headings**: Space Grotesk (font-heading)
- **Body**: Inter (font-body)
- Sizes: text-4xl (dashboard title), text-3xl (stats), text-base (body)

### Components
- `.btn` - Button base styles
- `.btn-primary` - Primary button (blue)
- `.btn-secondary` - Secondary button (gray)
- `.card` - White card with shadow and border
- `.input` - Form input with focus ring
- `.badge` - Small status badge

## Testing IDs

All interactive elements include `data-testid` attributes for testing:
- Navigation: `nav-dashboard`, `nav-employees`, `nav-tasks`
- Cards: `employee-card-{id}`, `task-card-{id}`
- Buttons: `add-task-button`, `submit-task-button`
- Forms: `task-title-input`, `task-employee-select`
- Filters: `filter-pending`, `filter-completed`, etc.

## Notes

- **No API Integration**: This is frontend-only with mock data
- **State Management**: React useState with localStorage
- **No Backend**: All operations are client-side
- **Data Persistence**: Uses browser localStorage
- **Production Ready**: Optimized build with Vite

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- LocalStorage API required
