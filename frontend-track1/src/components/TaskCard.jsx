import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, employeeName }) => {
  const statusConfig = {
    'Completed': {
      color: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-500/30',
      icon: CheckCircle,
    },
    'In Progress': {
      color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30',
      icon: Clock,
    },
    'Pending': {
      color: 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/30',
      icon: AlertCircle,
    },
  };

  const config = statusConfig[task.status] || statusConfig['Pending'];
  const StatusIcon = config.icon;

  return (
    <div className="card" data-testid={`task-card-${task.id}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex-1" data-testid={`task-title-${task.id}`}>
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
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300" data-testid={`task-employee-${task.id}`}>
          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
            <span className="text-xs font-medium text-primary-700 dark:text-primary-400">
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
