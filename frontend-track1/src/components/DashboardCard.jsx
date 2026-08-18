import React from 'react';

const DashboardCard = ({ icon: Icon, title, value, percentage }) => {
  return (
    <div className="flex-1 min-w-[130px]" data-testid={`dashboard-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-4 h-4 text-chartreuse/70" />
        <p className="eyebrow text-chartreuse/70">{title}</p>
      </div>
      <p className="text-4xl md:text-5xl font-heading font-extrabold text-chartreuse leading-none">
        {value}
        {percentage !== undefined && (
          <span className="text-base font-mono font-normal text-chartreuse/60 ml-2">({percentage}%)</span>
        )}
      </p>
    </div>
  );
};

export default DashboardCard;
