import React from 'react';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import { Users, CheckSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = ({ employees }) => {
  // Calculate statistics
  const totalEmployees = employees.length;
  const allTasks = employees.flatMap((emp) =>
    emp.tasks.map((task) => ({ ...task, employeeName: emp.name }))
  );
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = allTasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = allTasks.filter((t) => t.status === 'Pending').length;
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get recent tasks (last 5)
  const recentTasks = allTasks.slice(0, 5);

  return (
    <div data-testid="dashboard-page">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="dashboard-title">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Overview of team tasks and performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard
          icon={Users}
          title="Total Employees"
          value={totalEmployees}
          color="primary"
        />
        <DashboardCard
          icon={CheckSquare}
          title="Total Tasks"
          value={totalTasks}
          color="blue"
        />
        <DashboardCard
          icon={CheckCircle}
          title="Completed Tasks"
          value={completedTasks}
          percentage={completedPercentage}
          color="green"
        />
        <DashboardCard
          icon={Clock}
          title="In Progress"
          value={inProgressTasks}
          color="blue"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Completed</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white" data-testid="completed-count">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500 dark:text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">In Progress</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white" data-testid="inprogress-count">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Pending</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white" data-testid="pending-count">{pendingTasks}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Completion Progress</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid="completion-percentage">{completedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-500 dark:to-teal-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completedPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} employeeName={task.employeeName} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">No tasks available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
