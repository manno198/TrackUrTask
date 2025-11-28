import React, { useState } from 'react';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Plus } from 'lucide-react';

const Tasks = ({ employees, setEmployees }) => {
  const [filter, setFilter] = useState('All');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Get all tasks with employee names
  const allTasks = employees.flatMap((emp) =>
    emp.tasks.map((task) => ({ ...task, employeeName: emp.name, employeeId: emp.id }))
  );

  const handleAddTask = (formData) => {
    const newTask = {
      id: Date.now(),
      title: formData.title,
      status: formData.status,
    };

    // Update employees state
    const updatedEmployees = employees.map((emp) => {
      if (emp.id === formData.employeeId) {
        return {
          ...emp,
          tasks: [...emp.tasks, newTask],
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
  };

  return (
    <div data-testid="tasks-page">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="tasks-title">
            All Tasks
          </h1>
          <button
            onClick={() => setShowTaskForm(true)}
            data-testid="add-task-button"
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300">View and manage all team tasks</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Task List */}
      <TaskList tasks={allTasks} filter={filter} />

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          employees={employees}
          onSubmit={handleAddTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

export default Tasks;
