import React from 'react';

const DashboardCard = ({ icon: Icon, title, value, color = 'primary', percentage }) => {
  const colorClasses = {
    primary: 'from-teal-600 to-teal-700 dark:from-teal-600 dark:to-teal-700',
    green: 'from-teal-600 to-teal-700 dark:from-teal-600 dark:to-teal-700',
    blue: 'from-red-800 to-red-900 dark:from-red-800 dark:to-red-900',
    orange: 'from-red-800 to-red-900 dark:from-red-800 dark:to-red-900',
  };

  return (
    <div className="card hover:scale-105" data-testid={`dashboard-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
            {percentage !== undefined && (
              <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">({percentage}%)</span>
            )}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
