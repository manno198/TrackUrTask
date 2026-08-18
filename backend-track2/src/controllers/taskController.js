const { Task, Employee } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const employeeInclude = {
  model: Employee,
  as: 'employee',
  attributes: ['id', 'name', 'role', 'email'],
};

// @desc    Get all tasks with filters
// @route   GET /api/tasks?status=Pending&employeeId=xxx&priority=High
// @access  Public
const getTasks = asyncHandler(async (req, res) => {
  const { status, employeeId, priority } = req.query;
  const where = {};

  if (status) {
    where.status = status;
  }

  if (employeeId) {
    where.employeeId = employeeId;
  }

  if (priority) {
    where.priority = priority;
  }

  const tasks = await Task.findAll({
    where,
    include: [employeeInclude],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [employeeInclude],
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Protected
const createTask = asyncHandler(async (req, res) => {
  const { title, employee, employeeId, description, status, priority, dueDate } = req.body;

  // Support both 'employee' and 'employeeId' in request body
  const assignedEmployeeId = employeeId || employee;

  const employeeExists = await Employee.findByPk(assignedEmployeeId);
  if (!employeeExists) {
    throw new AppError('Employee not found', 404);
  }

  const task = await Task.create({
    title,
    description,
    status: status || 'Pending',
    priority: priority || 'Medium',
    dueDate,
    employeeId: assignedEmployeeId,
  });

  const populatedTask = await Task.findByPk(task.id, {
    include: [employeeInclude],
  });

  res.status(201).json({
    success: true,
    data: populatedTask,
    message: 'Task created successfully',
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Protected
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (req.body.employee || req.body.employeeId) {
    const newEmployeeId = req.body.employeeId || req.body.employee;
    const employeeExists = await Employee.findByPk(newEmployeeId);

    if (!employeeExists) {
      throw new AppError('Employee not found', 404);
    }

    req.body.employeeId = newEmployeeId;
    delete req.body.employee;
  }

  await task.update(req.body);

  const updatedTask = await Task.findByPk(task.id, {
    include: [employeeInclude],
  });

  res.status(200).json({
    success: true,
    data: updatedTask,
    message: 'Task updated successfully',
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Protected
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await task.destroy();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Task deleted successfully',
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
