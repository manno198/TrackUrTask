const { Task, Employee } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

const STATUS_VALUES = ['Pending', 'In Progress', 'Completed'];
const PRIORITY_VALUES = ['Low', 'Medium', 'High'];

const employeeInclude = {
  model: Employee,
  as: 'employee',
  attributes: ['id', 'name', 'role', 'email'],
};

// @desc    Dashboard aggregate stats
// @route   GET /api/stats/dashboard
// @access  Public
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalEmployees, statusRows, priorityRows, recentTasks, employees, taskProjections] =
    await Promise.all([
      Employee.count(),
      Task.count({ group: ['status'] }),
      Task.count({ group: ['priority'] }),
      Task.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [employeeInclude],
      }),
      Employee.findAll({ attributes: ['id', 'name', 'role'], order: [['name', 'ASC']] }),
      Task.findAll({ attributes: ['status', 'employeeId'] }),
    ]);

  const tasksByStatus = Object.fromEntries(STATUS_VALUES.map((s) => [s, 0]));
  statusRows.forEach((row) => {
    tasksByStatus[row.status] = row.count;
  });

  const tasksByPriority = Object.fromEntries(PRIORITY_VALUES.map((p) => [p, 0]));
  priorityRows.forEach((row) => {
    tasksByPriority[row.priority] = row.count;
  });

  const totalTasks = Object.values(tasksByStatus).reduce((sum, n) => sum + n, 0);

  const workloadByEmployee = new Map(
    employees.map((emp) => [
      emp.id,
      { employeeId: emp.id, name: emp.name, role: emp.role, total: 0, pending: 0, inProgress: 0, completed: 0 },
    ])
  );

  taskProjections.forEach((task) => {
    const entry = workloadByEmployee.get(task.employeeId);
    if (!entry) return;
    entry.total += 1;
    if (task.status === 'Pending') entry.pending += 1;
    if (task.status === 'In Progress') entry.inProgress += 1;
    if (task.status === 'Completed') entry.completed += 1;
  });

  res.status(200).json({
    success: true,
    data: {
      totalEmployees,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      recentTasks,
      employeeWorkload: Array.from(workloadByEmployee.values()),
    },
  });
});

module.exports = { getDashboardStats };
