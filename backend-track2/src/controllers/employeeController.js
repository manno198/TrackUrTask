const { Employee, Task } = require('../models');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      order: [['createdAt', 'DESC']],
    });
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee with tasks
// @route   GET /api/employees/:id
// @access  Public
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{
        model: Task,
        as: 'tasks',
      }],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID',
      });
    }
    next(error);
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Public
const createEmployee = async (req, res, next) => {
  try {
    const { name, role, email } = req.body;

    // Validation
    if (!name || !role || !email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, role, and email',
      });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
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
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Public
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    // Check if updating email and if it already exists
    if (req.body.email && req.body.email.toLowerCase() !== employee.email) {
      const existingEmployee = await Employee.findOne({ 
        where: { email: req.body.email.toLowerCase() } 
      });
      
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
        });
      }
    }

    // Update employee
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }

    await employee.update(req.body);

    res.status(200).json({
      success: true,
      data: employee,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID',
      });
    }
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Public
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
    }

    // Delete all tasks associated with this employee (CASCADE will handle this)
    await Task.destroy({ where: { employeeId: req.params.id } });

    // Delete employee
    await employee.destroy();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Employee and associated tasks deleted successfully',
    });
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID',
      });
    }
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
