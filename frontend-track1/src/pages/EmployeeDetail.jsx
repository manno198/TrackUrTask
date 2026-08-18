import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import StatusMessage from '../components/StatusMessage';
import { ArrowLeft, Mail, Briefcase } from 'lucide-react';
import * as employeeService from '../services/employeeService';
import { getErrorMessage } from '../services/api';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    employeeService
      .getEmployee(id)
      .then((data) => {
        if (!cancelled) setEmployee(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <StatusMessage type="loading" message="Loading employee..." />;
  }

  if (error || !employee) {
    return (
      <div className="text-center py-12" data-testid="employee-not-found">
        <h2 className="text-2xl font-heading font-extrabold text-ink mb-4">
          {error || 'Employee Not Found'}
        </h2>
        <Link to="/employees" className="btn btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>
      </div>
    );
  }

  const tasks = employee.tasks || [];
  const filteredTasks = filter === 'All' ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div data-testid="employee-detail-page">
      <Link
        to="/employees"
        data-testid="back-to-employees"
        className="inline-flex items-center gap-2 text-ink hover:underline mb-6 font-bold text-sm uppercase tracking-wide"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      <div className="card mb-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-20 h-20 rounded-lg bg-ink flex items-center justify-center flex-shrink-0 border-2 border-ink">
            <span className="text-3xl font-heading font-extrabold text-chartreuse">
              {employee.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-3xl font-heading font-extrabold mb-2" data-testid="employee-detail-name">
              {employee.name}
            </h1>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-ink/70">
                <Briefcase className="w-4 h-4" />
                <span data-testid="employee-detail-role" className="font-medium">{employee.role}</span>
              </div>
              <div className="flex items-center gap-2 text-ink/70">
                <Mail className="w-4 h-4" />
                <span data-testid="employee-detail-email" className="font-mono text-sm">{employee.email}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-heading font-extrabold" data-testid="employee-detail-task-count">{tasks.length}</p>
            <p className="eyebrow text-ink/50">Total Tasks</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-heading font-extrabold mb-4">Tasks</h2>

        <div className="card mb-6">
          <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {filteredTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="employee-task-list">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12" data-testid="no-tasks-message">
            <p className="text-ink/60">
              {filter === 'All'
                ? 'No tasks assigned to this employee'
                : `No ${filter.toLowerCase()} tasks`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
