import React, { useCallback, useEffect, useState } from 'react';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import StatusMessage from '../components/StatusMessage';
import { Plus, Search } from 'lucide-react';
import * as taskService from '../services/taskService';
import * as employeeService from '../services/employeeService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { showToast } = useToast();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTasks({
        status: statusFilter,
        priority: priorityFilter,
        employeeId: employeeFilter !== 'All' ? employeeFilter : undefined,
      });
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, employeeFilter]);

  useEffect(() => {
    employeeService.getEmployees().then(setEmployees).catch((err) => setError(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const visibleTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Whether a task belongs under the currently active filters — used to keep
  // optimistic inserts/updates consistent without an extra round-trip fetch.
  const matchesActiveFilters = (task) => {
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
    if (employeeFilter !== 'All' && String(task.employeeId) !== String(employeeFilter)) return false;
    return true;
  };

  const handleCreate = async (formData) => {
    const created = await taskService.createTask(formData);
    if (matchesActiveFilters(created)) {
      setTasks((prev) => [created, ...prev]);
    }
    showToast(`"${created.title}" created`);
  };

  const handleUpdate = async (formData) => {
    const updated = await taskService.updateTask(editingTask.id, formData);
    setTasks((prev) => {
      const withoutOld = prev.filter((t) => t.id !== updated.id);
      return matchesActiveFilters(updated) ? [updated, ...withoutOld] : withoutOld;
    });
    showToast(`"${updated.title}" updated`);
  };

  const handleStatusChange = async (taskId, status) => {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    try {
      await taskService.updateTask(taskId, { status });
    } catch (err) {
      setTasks(previous);
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await taskService.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      showToast(`"${task.title}" deleted`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div data-testid="tasks-page">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-heading font-extrabold" data-testid="tasks-title">
            All Tasks
          </h1>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            data-testid="add-task-button"
            className="btn btn-primary"
            disabled={employees.length === 0}
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
        <p className="text-ink/60">View and manage all team tasks</p>
      </div>

      <div className="card mb-8 space-y-4">
        <TaskFilters
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          employeeFilter={employeeFilter}
          onEmployeeChange={setEmployeeFilter}
          employees={employees}
        />
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink/40" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            data-testid="task-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {error && <div className="mb-6"><StatusMessage type="error" message={error} /></div>}

      {loading ? (
        <StatusMessage type="loading" message="Loading tasks..." />
      ) : (
        <TaskList
          tasks={visibleTasks}
          emptyMessage={searchTerm ? `No tasks match "${searchTerm}"` : 'No tasks match the current filters.'}
          onStatusChange={handleStatusChange}
          onEdit={(task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showTaskForm && (
        <TaskForm
          employees={employees}
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Tasks;
