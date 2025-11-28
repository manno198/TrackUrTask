import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import EmployeeDetail from './pages/EmployeeDetail';
import { mockData } from './data/mockData';
import useLocalStorage from './hooks/useLocalStorage';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  // Use localStorage to persist data (bonus feature)
  const [employees, setEmployees] = useLocalStorage('employeeData', mockData.employees);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard employees={employees} />} />
            <Route path="/employees" element={<Employees employees={employees} />} />
            <Route path="/employees/:id" element={<EmployeeDetail employees={employees} />} />
            <Route path="/tasks" element={<Tasks employees={employees} setEmployees={setEmployees} />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
