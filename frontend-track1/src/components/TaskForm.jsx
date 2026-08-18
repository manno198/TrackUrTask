import React, { useState } from 'react';
import { X } from 'lucide-react';

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const labelClass = 'block text-xs font-bold uppercase tracking-wide text-ink mb-2';

const TaskForm = ({ employees, task, onSubmit, onClose }) => {
  const isEdit = !!task;
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    employeeId: task?.employeeId || employees[0]?.id || '',
    status: task?.status || 'Pending',
    priority: task?.priority || 'Medium',
    dueDate: toDateInputValue(task?.dueDate),
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!formData.employeeId) {
      setError('Please select an employee');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        ...formData,
        employeeId: Number(formData.employeeId),
        dueDate: formData.dueDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/70 flex items-center justify-center z-50 p-4" data-testid="task-form-modal">
      <div className="bg-white rounded-xl border-[3px] border-ink shadow-block max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-extrabold">
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            data-testid="close-task-form"
            className="p-1.5 border-2 border-ink rounded-md hover:bg-chartreuse-100 transition-colors"
          >
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium" data-testid="form-error">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className={labelClass}>
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
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              data-testid="task-description-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Optional details"
            />
          </div>

          <div>
            <label htmlFor="employee" className={labelClass}>
              Assign To *
            </label>
            <select
              id="employee"
              data-testid="task-employee-select"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="input"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className={labelClass}>
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

            <div>
              <label htmlFor="priority" className={labelClass}>
                Priority
              </label>
              <select
                id="priority"
                data-testid="task-priority-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className={labelClass}>
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              data-testid="task-duedate-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input"
            />
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
              disabled={submitting}
              className="btn btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
