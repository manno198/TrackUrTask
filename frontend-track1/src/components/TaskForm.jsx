import React, { useState } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({ employees, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    employeeId: employees[0]?.id || '',
    status: 'Pending',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    if (!formData.employeeId) {
      setError('Please select an employee');
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="task-form-modal">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 animate-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Add New Task</h2>
          <button
            onClick={onClose}
            data-testid="close-task-form"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm" data-testid="form-error">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              data-testid="task-title-input"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setError('');
              }}
              className="input"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign To *
            </label>
            <select
              id="employee"
              data-testid="task-employee-select"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
              className="input"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              data-testid="task-status-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              data-testid="cancel-task-button"
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-task-button"
              className="btn btn-primary flex-1"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
