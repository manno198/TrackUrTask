import React from 'react';
import { Calendar, ChevronDown, Pencil, Trash2 } from 'lucide-react';

const statusColor = {
  Completed: 'bg-spring',
  'In Progress': 'bg-electric',
  Pending: 'bg-flash',
};

const priorityColor = {
  High: 'bg-flash',
  Medium: 'bg-electric',
  Low: 'bg-spring',
};

const TaskCard = ({ task, employeeName, onStatusChange, onEdit, onDelete }) => {
  return (
    <div className="card flex flex-col" data-testid={`task-card-${task.id}`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-base font-bold text-ink flex-1" data-testid={`task-title-${task.id}`}>
          {task.title}
        </h3>
        {task.priority && (
          <span
            className={`badge ${priorityColor[task.priority]} text-ink flex-shrink-0`}
            data-testid={`task-priority-${task.id}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-ink/60 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mb-3 mt-auto pt-1">
        {onStatusChange ? (
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              data-testid={`task-status-select-${task.id}`}
              className={`badge ${statusColor[task.status]} text-ink cursor-pointer appearance-none pr-6`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="w-3 h-3 text-ink absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <span
            className={`badge ${statusColor[task.status]} text-ink`}
            data-testid={`task-status-${task.id}`}
          >
            {task.status}
          </span>
        )}

        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs font-mono text-ink/50" data-testid={`task-duedate-${task.id}`}>
            <Calendar className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {employeeName && (
        <div className="flex items-center gap-2 text-sm text-ink mb-3" data-testid={`task-employee-${task.id}`}>
          <div className="w-6 h-6 rounded-md bg-ink flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-chartreuse">
              {employeeName.charAt(0)}
            </span>
          </div>
          <span className="font-medium">{employeeName}</span>
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-3 border-t-2 border-ink/10">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              data-testid={`task-edit-${task.id}`}
              className="btn btn-secondary flex-1 py-1.5 text-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              data-testid={`task-delete-${task.id}`}
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

export default TaskCard;
