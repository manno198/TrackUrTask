import React, { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import StatusMessage from '../components/StatusMessage';
import { Users, CheckSquare, CheckCircle, AlertCircle } from 'lucide-react';
import * as statsService from '../services/statsService';
import { getErrorMessage } from '../services/api';

const priorityBadge = {
  High: 'bg-flash text-ink',
  Medium: 'bg-electric text-ink',
  Low: 'bg-spring text-ink',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    statsService
      .getDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data);
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
  }, []);

  if (loading) {
    return <StatusMessage type="loading" message="Loading dashboard..." />;
  }

  if (error || !stats) {
    return <StatusMessage type="error" message={error || 'Could not load dashboard data'} />;
  }

  const { totalEmployees, totalTasks, tasksByStatus, tasksByPriority, recentTasks, employeeWorkload } = stats;
  const completedTasks = tasksByStatus.Completed;
  const inProgressTasks = tasksByStatus['In Progress'];
  const pendingTasks = tasksByStatus.Pending;
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div data-testid="dashboard-page">
      {/* Hero stats block */}
      <div className="bg-ink rounded-xl border-[3px] border-ink p-8 md:p-10 mb-8">
        <p className="eyebrow text-chartreuse/60 mb-2">Overview</p>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-chartreuse mb-8" data-testid="dashboard-title">
          TEAM TASK CONTROL
        </h1>
        <div className="flex flex-wrap gap-x-8 gap-y-6 divide-x-0 md:divide-x divide-chartreuse/20">
          <DashboardCard icon={Users} title="Employees" value={totalEmployees} />
          <div className="md:pl-8">
            <DashboardCard icon={CheckSquare} title="Tasks" value={totalTasks} />
          </div>
          <div className="md:pl-8">
            <DashboardCard icon={CheckCircle} title="Completed" value={completedTasks} percentage={completedPercentage} />
          </div>
          <div className="md:pl-8">
            <DashboardCard icon={AlertCircle} title="High Priority" value={tasksByPriority.High} />
          </div>
        </div>
      </div>

      {/* Breakdown cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="card">
          <h3 className="text-lg font-heading font-extrabold mb-4">Task Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="badge bg-flash text-ink">Pending</span>
              <span className="font-mono font-bold text-lg" data-testid="pending-count">{pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="badge bg-electric text-ink">In Progress</span>
              <span className="font-mono font-bold text-lg" data-testid="inprogress-count">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="badge bg-spring text-ink">Completed</span>
              <span className="font-mono font-bold text-lg" data-testid="completed-count">{completedTasks}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-extrabold mb-4">Priority Breakdown</h3>
          <div className="space-y-3">
            {['High', 'Medium', 'Low'].map((priority) => (
              <div key={priority} className="flex items-center justify-between">
                <span className={`badge ${priorityBadge[priority]}`}>{priority}</span>
                <span className="font-mono font-bold text-lg" data-testid={`priority-${priority.toLowerCase()}-count`}>
                  {tasksByPriority[priority]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="eyebrow text-ink/50">Overall Progress</p>
          <span className="font-mono font-bold text-ink" data-testid="completion-percentage">{completedPercentage}%</span>
        </div>
        <div className="w-full bg-chartreuse-100 border-2 border-ink rounded-full h-4 mb-3 overflow-hidden">
          <div
            className="bg-spring h-full transition-all duration-500"
            style={{ width: `${completedPercentage}%` }}
          />
        </div>
        <p className="text-sm text-ink/60 font-mono">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Team Workload */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-extrabold mb-4">Team Workload</h2>
        {employeeWorkload.length > 0 ? (
          <div className="card" data-testid="team-workload">
            <div className="divide-y-2 divide-ink/10">
              {employeeWorkload.map((w) => (
                <div key={w.employeeId} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" data-testid={`workload-${w.employeeId}`}>
                  <div>
                    <p className="font-bold text-ink">{w.name}</p>
                    <p className="eyebrow text-ink/40">{w.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <span className="badge bg-flash text-ink">{w.pending} Pending</span>
                    <span className="badge bg-electric text-ink">{w.inProgress} In Progress</span>
                    <span className="badge bg-spring text-ink">{w.completed} Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-ink/60">No employees yet</p>
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div>
        <h2 className="text-2xl font-heading font-extrabold mb-4">Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} employeeName={task.employee?.name} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-ink/60">No tasks available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
