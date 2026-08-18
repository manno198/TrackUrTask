import React from 'react';
import TaskCard from './TaskCard';
import { Inbox } from 'lucide-react';

const TaskList = ({ tasks, emptyMessage, onStatusChange, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="card text-center py-12" data-testid="empty-tasks-message">
        <Inbox className="w-14 h-14 text-ink/20 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-extrabold mb-2">No tasks found</h3>
        <p className="text-ink/60">
          {emptyMessage || 'No tasks match the current filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          employeeName={task.employee?.name || task.employeeName}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
