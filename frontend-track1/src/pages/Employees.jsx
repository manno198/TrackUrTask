import React, { useEffect, useMemo, useState } from 'react';
import EmployeeCard from '../components/EmployeeCard';
import EmployeeForm from '../components/EmployeeForm';
import StatusMessage from '../components/StatusMessage';
import { Search, Users, Plus } from 'lucide-react';
import * as employeeService from '../services/employeeService';
import * as statsService from '../services/statsService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [employeeData, stats] = await Promise.all([
        employeeService.getEmployees(),
        statsService.getDashboardStats(),
      ]);
      setEmployees(employeeData);
      setWorkload(stats.employeeWorkload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const taskCountsByEmployee = useMemo(() => {
    const map = {};
    workload.forEach((w) => {
      map[w.employeeId] = { total: w.total, completed: w.completed, inProgress: w.inProgress, pending: w.pending };
    });
    return map;
  }, [workload]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (formData) => {
    const created = await employeeService.createEmployee(formData);
    setEmployees((prev) => [created, ...prev]);
    showToast(`${created.name} added`);
  };

  const handleUpdate = async (formData) => {
    const updated = await employeeService.updateEmployee(editingEmployee.id, formData);
    setEmployees((prev) => prev.map((emp) => (emp.id === updated.id ? updated : emp)));
    showToast(`${updated.name} updated`);
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete ${employee.name}? This will also delete their tasks.`)) return;
    try {
      await employeeService.deleteEmployee(employee.id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
      showToast(`${employee.name} deleted`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div data-testid="employees-page">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-heading font-extrabold" data-testid="employees-title">
            Employees
          </h1>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(true);
            }}
            data-testid="add-employee-button"
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>
        <p className="text-ink/60">Manage your team members and their tasks</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink/40" />
          <input
            type="text"
            placeholder="Search employees by name or role..."
            data-testid="employee-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {error && <div className="mb-6"><StatusMessage type="error" message={error} /></div>}

      {loading ? (
        <StatusMessage type="loading" message="Loading employees..." />
      ) : filteredEmployees.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="employee-list">
          {filteredEmployees.map((employee, index) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              index={index}
              taskCounts={taskCountsByEmployee[employee.id]}
              onEdit={(emp) => {
                setEditingEmployee(emp);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12" data-testid="no-employees-message">
          <Users className="w-14 h-14 text-ink/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-extrabold mb-2">No employees found</h3>
          <p className="text-ink/60">
            {searchTerm ? `No results for "${searchTerm}"` : 'No employees available'}
          </p>
        </div>
      )}

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default Employees;
