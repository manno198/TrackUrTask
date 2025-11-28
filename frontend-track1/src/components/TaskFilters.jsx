import React from 'react';
import { Filter } from 'lucide-react';

const TaskFilters = ({ currentFilter, onFilterChange }) => {
  const filters = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="flex flex-wrap items-center gap-3" data-testid="task-filters">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter className="w-5 h-5" />
        <span className="text-sm font-medium">Filter:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            data-testid={`filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentFilter === filter
                ? 'bg-primary-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;
