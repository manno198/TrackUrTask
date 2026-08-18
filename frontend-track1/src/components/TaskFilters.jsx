import React from 'react';
import { Filter } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];
const PRIORITY_FILTERS = ['All', 'Low', 'Medium', 'High'];

const TaskFilters = ({
  currentFilter,
  onFilterChange,
  priorityFilter = 'All',
  onPriorityChange,
  employeeFilter = 'All',
  onEmployeeChange,
  employees = [],
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4" data-testid="task-filters">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-ink">
          <Filter className="w-4 h-4" />
          <span className="eyebrow">Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              data-testid={`filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border-2 transition-all ${
                currentFilter === filter
                  ? 'bg-ink text-chartreuse border-ink'
                  : 'bg-white text-ink border-ink/20 hover:border-ink'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {onPriorityChange && (
        <div className="flex items-center gap-2">
          <span className="eyebrow text-ink">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            data-testid="filter-priority-select"
            className="input py-1.5 text-sm w-auto"
          >
            {PRIORITY_FILTERS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {onEmployeeChange && (
        <div className="flex items-center gap-2">
          <span className="eyebrow text-ink">Employee:</span>
          <select
            value={employeeFilter}
            onChange={(e) => onEmployeeChange(e.target.value)}
            data-testid="filter-employee-select"
            className="input py-1.5 text-sm w-auto"
          >
            <option value="All">All</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
