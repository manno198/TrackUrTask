import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, employeeName }) => {
  const statusConfig = {
    'Completed': {
      color: 'bg-accent-200 text-accent-800 border-accent-300',
      icon: CheckCircle,
    },
    'In Progress': {
      color: 'bg-primary-100 text-primary-800 border-primary-200',
      icon: Clock,
    },
    'Pending': {
      color: 'bg-primary-200 text-primary-700 border-primary-300',
      icon: AlertCircle,
    },
  };

  const config = statusConfig[task.status] || statusConfig['Pending'];
  const StatusIcon = config.icon;

  return (
    <div className="card" data-testid={`task-card-${task.id}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 flex-1" data-testid={`task-title-${task.id}`}>
          {task.title}
        </h3>
        <span
          className={`badge ${config.color} border flex items-center gap-1 flex-shrink-0 ml-2 rounded-lg`}
          data-testid={`task-status-${task.id}`}
        >
          <StatusIcon className="w-3 h-3" />
          {task.status}
        </span>
      </div>
      
      {employeeName && (
        <div className="flex items-center gap-2 text-sm text-gray-600" data-testid={`task-employee-${task.id}`}>
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-medium text-primary-700">
              {employeeName.charAt(0)}
            </span>
          </div>
          <span>{employeeName}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
