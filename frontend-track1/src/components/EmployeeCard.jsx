import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

const avatarColors = ['bg-ink text-chartreuse', 'bg-forest text-chartreuse', 'bg-electric text-ink'];

const EmployeeCard = ({ employee, taskCounts, index = 0, onEdit, onDelete }) => {
  const counts = taskCounts || { total: 0, completed: 0, inProgress: 0, pending: 0 };
  const avatarClass = avatarColors[index % avatarColors.length];
  const initial = employee.name.charAt(0).toUpperCase();

  return (
    <div className="card" data-testid={`employee-card-${employee.id}`}>
      <Link to={`/employees/${employee.id}`} className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-ink font-heading font-extrabold text-2xl ${avatarClass}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading font-extrabold truncate" data-testid={`employee-name-${employee.id}`}>
            {employee.name}
          </h3>
          <p className="eyebrow text-ink/50 mb-3" data-testid={`employee-role-${employee.id}`}>{employee.role}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink/60 font-medium">Total Tasks</span>
              <span className="font-mono font-bold" data-testid={`employee-total-tasks-${employee.id}`}>{counts.total}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {counts.completed > 0 && (
                <span className="badge bg-spring text-ink" data-testid={`employee-completed-${employee.id}`}>
                  {counts.completed} Completed
                </span>
              )}
              {counts.inProgress > 0 && (
                <span className="badge bg-electric text-ink" data-testid={`employee-inprogress-${employee.id}`}>
                  {counts.inProgress} In Progress
                </span>
              )}
              {counts.pending > 0 && (
                <span className="badge bg-flash text-ink" data-testid={`employee-pending-${employee.id}`}>
                  {counts.pending} Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-3 mt-3 border-t-2 border-ink/10">
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              data-testid={`employee-edit-${employee.id}`}
              className="btn btn-secondary flex-1 py-1.5 text-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(employee)}
              data-testid={`employee-delete-${employee.id}`}
              className="btn btn-danger flex-1 py-1.5 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
