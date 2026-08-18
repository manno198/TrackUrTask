import React, { useState } from 'react';
import { X } from 'lucide-react';

const labelClass = 'block text-xs font-bold uppercase tracking-wide text-ink mb-2';

const EmployeeForm = ({ employee, onSubmit, onClose }) => {
  const isEdit = !!employee;
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    role: employee?.role || '',
    email: employee?.email || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim()) {
      setError('Name, role, and email are all required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/70 flex items-center justify-center z-50 p-4" data-testid="employee-form-modal">
      <div className="bg-white rounded-xl border-[3px] border-ink shadow-block max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-extrabold">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            data-testid="close-employee-form"
            className="p-1.5 border-2 border-ink rounded-md hover:bg-chartreuse-100 transition-colors"
          >
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium" data-testid="employee-form-error">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              data-testid="employee-name-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Full name"
            />
          </div>

          <div>
            <label htmlFor="role" className={labelClass}>
              Role *
            </label>
            <input
              type="text"
              id="role"
              data-testid="employee-role-input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              data-testid="employee-email-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="name@company.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              data-testid="cancel-employee-button"
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-employee-button"
              disabled={submitting}
              className="btn btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
