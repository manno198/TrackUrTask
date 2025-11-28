import React from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const EmployeeCard = ({ employee }) => {
  const completedTasks = employee.tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = employee.tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = employee.tasks.filter(t => t.status === 'Pending').length;

  return (
    <Link
      to={`/employees/${employee.id}`}
      data-testid={`employee-card-${employee.id}`}
      className="card hover:scale-105 hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" data-testid={`employee-name-${employee.id}`}>
            {employee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3" data-testid={`employee-role-${employee.id}`}>{employee.role}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-semibold text-gray-900" data-testid={`employee-total-tasks-${employee.id}`}>{employee.tasks.length}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {completedTasks > 0 && (
                <span className="badge bg-accent-200 text-accent-800 flex items-center gap-1 rounded-lg" data-testid={`employee-completed-${employee.id}`}>
                  <CheckCircle className="w-3 h-3" />
                  {completedTasks} Completed
                </span>
              )}
              {inProgressTasks > 0 && (
                <span className="badge bg-primary-100 text-primary-800 flex items-center gap-1 rounded-lg" data-testid={`employee-inprogress-${employee.id}`}>
                  <Clock className="w-3 h-3" />
                  {inProgressTasks} In Progress
                </span>
              )}
              {pendingTasks > 0 && (
                <span className="badge bg-primary-200 text-primary-700 flex items-center gap-1 rounded-lg" data-testid={`employee-pending-${employee.id}`}>
                  <AlertCircle className="w-3 h-3" />
                  {pendingTasks} Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EmployeeCard;
