import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import { ArrowLeft, User, Mail, Briefcase } from 'lucide-react';

const EmployeeDetail = ({ employees }) => {
  const { id } = useParams();
  const [filter, setFilter] = useState('All');
  
  const employee = employees.find((emp) => emp.id === parseInt(id));

  if (!employee) {
    return (
      <div className="text-center py-12" data-testid="employee-not-found">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h2>
        <Link to="/employees" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>
      </div>
    );
  }

  const filteredTasks = filter === 'All'
    ? employee.tasks
    : employee.tasks.filter((task) => task.status === filter);

  return (
    <div data-testid="employee-detail-page">
      {/* Back Button */}
      <Link
        to="/employees"
        data-testid="back-to-employees"
        className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      {/* Employee Info Card */}
      <div className="card mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-primary-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="employee-detail-name">
              {employee.name}
            </h1>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-5 h-5" />
                <span data-testid="employee-detail-role">{employee.role}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{employee.name.toLowerCase().replace(' ', '.')}@company.com</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900" data-testid="employee-detail-task-count">{employee.tasks.length}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks</h2>
        
        {/* Filters */}
        <div className="mb-6">
          <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="employee-task-list">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12" data-testid="no-tasks-message">
            <p className="text-gray-600">
              {filter === 'All'
                ? 'No tasks assigned to this employee'
                : `No ${filter.toLowerCase()} tasks`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
