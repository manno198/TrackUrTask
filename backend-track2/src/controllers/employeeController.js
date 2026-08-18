const { Employee, Task } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});

// @desc    Get single employee with tasks
// @route   GET /api/employees/:id
// @access  Public
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByPk(req.params.id, {
    include: [{
      model: Task,
      as: 'tasks',
    }],
  });

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

// @desc    Create employee
// @route   POST /api/employees
// @access  Protected
const createEmployee = asyncHandler(async (req, res) => {
  const { name, role, email } = req.body;

  const existingEmployee = await Employee.findOne({
    where: { email: email.toLowerCase() },
  });

  if (existingEmployee) {
    throw new AppError('Email already exists', 400);
  }

  const employee = await Employee.create({
    name,
    role,
    email: email.toLowerCase(),
  });

  res.status(201).json({
    success: true,
    data: employee,
    message: 'Employee created successfully',
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Protected
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  if (req.body.email && req.body.email.toLowerCase() !== employee.email) {
    const existingEmployee = await Employee.findOne({
      where: { email: req.body.email.toLowerCase() },
    });

    if (existingEmployee) {
      throw new AppError('Email already exists', 400);
    }
  }

  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }

  await employee.update(req.body);

  res.status(200).json({
    success: true,
    data: employee,
    message: 'Employee updated successfully',
  });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Protected
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  // Delete all tasks associated with this employee (CASCADE will handle this)
  await Task.destroy({ where: { employeeId: req.params.id } });

  await employee.destroy();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Employee and associated tasks deleted successfully',
  });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
