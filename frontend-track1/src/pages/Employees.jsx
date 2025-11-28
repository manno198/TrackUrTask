import React, { useState } from 'react';
import EmployeeCard from '../components/EmployeeCard';
import { Search, Users } from 'lucide-react';

const Employees = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div data-testid="employees-page">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="employees-title">
          Employees
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your team members and their tasks</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name or role..."
            data-testid="employee-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Employee Cards */}
      {filteredEmployees.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="employee-list">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12" data-testid="no-employees-message">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No employees found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm ? `No results for "${searchTerm}"` : 'No employees available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Employees;
