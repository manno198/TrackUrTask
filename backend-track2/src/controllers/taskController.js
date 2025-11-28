const { Task, Employee } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all tasks with filters
// @route   GET /api/tasks?status=Pending&employeeId=xxx
// @access  Public
const getTasks = async (req, res, next) => {
  try {
    const { status, employeeId } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const tasks = await Task.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'role', 'email'],
      }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'role', 'email'],
      }],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID',
      });
    }
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Protected (with auth middleware)
const createTask = async (req, res, next) => {
  try {
    const { title, employee, employeeId, description, status, priority, dueDate } = req.body;

    // Support both 'employee' and 'employeeId' in request body
    const assignedEmployeeId = employeeId || employee;

    // Validation
    if (!title || !assignedEmployeeId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title and employee ID',
      });
    }

    // Check if employee exists
    const employeeExists = await Employee.findByPk(assignedEmployeeId);
    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      employeeId: assignedEmployeeId,
    });

    // Fetch task with employee info
    const populatedTask = await Task.findByPk(task.id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'role', 'email'],
      }],
    });

    res.status(201).json({
      success: true,
      data: populatedTask,
      message: 'Task created successfully',
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID',
      });
    }
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Protected (with auth middleware)
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    // If updating employee, check if new employee exists
    if (req.body.employee || req.body.employeeId) {
      const newEmployeeId = req.body.employeeId || req.body.employee;
      const employeeExists = await Employee.findByPk(newEmployeeId);
      
      if (!employeeExists) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
        });
      }
      
      // Normalize to employeeId
      req.body.employeeId = newEmployeeId;
      delete req.body.employee;
    }

    await task.update(req.body);

    // Fetch updated task with employee info
    const updatedTask = await Task.findByPk(task.id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'role', 'email'],
      }],
    });

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully',
    });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID',
      });
    }
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID',
      });
    }
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Protected (with auth middleware)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Task deleted successfully',
    });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID',
      });
    }
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
