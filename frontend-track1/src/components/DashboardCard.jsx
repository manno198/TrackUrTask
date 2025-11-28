import React from 'react';

const DashboardCard = ({ icon: Icon, title, value, color = 'primary', percentage }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-accent-500 to-accent-600',
    blue: 'from-primary-400 to-primary-500',
    orange: 'from-primary-500 to-primary-600',
  };

  return (
    <div className="card hover:scale-105" data-testid={`dashboard-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value}
            {percentage !== undefined && (
              <span className="text-lg text-gray-500 ml-2">({percentage}%)</span>
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
