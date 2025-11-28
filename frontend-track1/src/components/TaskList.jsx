import React from 'react';
import TaskCard from './TaskCard';
import { Inbox } from 'lucide-react';

const TaskList = ({ tasks, filter }) => {
  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  if (filteredTasks.length === 0) {
    return (
      <div className="card text-center py-12" data-testid="empty-tasks-message">
        <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {filter === 'All' 
            ? 'No tasks available. Add your first task to get started!' 
            : `No ${filter.toLowerCase()} tasks at the moment.`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="task-list">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          employeeName={task.employeeName}
        />
      ))}
    </div>
  );
};

export default TaskList;
