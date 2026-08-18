const validator = require('validator');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const runRules = (rules) => (req, res, next) => {
  const errors = [];

  rules.forEach(({ field, message, test, optional }) => {
    const value = req.body[field];
    if (optional && (value === undefined || value === null || value === '')) {
      return;
    }
    if (!test(value, req.body)) {
      errors.push({ field, message });
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.map((e) => e.message).join(', '),
      errors,
    });
  }

  next();
};

const employeeRules = ({ optional }) => [
  {
    field: 'name',
    message: 'Name must be between 2 and 100 characters',
    optional,
    test: (v) => isNonEmptyString(v) && v.trim().length >= 2 && v.trim().length <= 100,
  },
  {
    field: 'role',
    message: 'Role is required and must be at most 100 characters',
    optional,
    test: (v) => isNonEmptyString(v) && v.trim().length <= 100,
  },
  {
    field: 'email',
    message: 'A valid email is required',
    optional,
    test: (v) => isNonEmptyString(v) && validator.isEmail(v),
  },
];

const STATUS_VALUES = ['Pending', 'In Progress', 'Completed'];
const PRIORITY_VALUES = ['Low', 'Medium', 'High'];

const taskRules = ({ optional, requireEmployee }) => [
  {
    field: 'title',
    message: 'Title must be between 3 and 200 characters',
    optional,
    test: (v) => isNonEmptyString(v) && v.trim().length >= 3 && v.trim().length <= 200,
  },
  {
    field: 'description',
    message: 'Description cannot exceed 1000 characters',
    optional: true,
    test: (v) => typeof v === 'string' && v.length <= 1000,
  },
  {
    field: 'employeeId',
    message: 'A valid employeeId is required',
    optional: !requireEmployee,
    test: (v, body) => {
      const id = v ?? body.employee;
      return id !== undefined && id !== null && id !== '' && !Number.isNaN(Number(id));
    },
  },
  {
    field: 'status',
    message: `Status must be one of: ${STATUS_VALUES.join(', ')}`,
    optional: true,
    test: (v) => STATUS_VALUES.includes(v),
  },
  {
    field: 'priority',
    message: `Priority must be one of: ${PRIORITY_VALUES.join(', ')}`,
    optional: true,
    test: (v) => PRIORITY_VALUES.includes(v),
  },
  {
    field: 'dueDate',
    message: 'dueDate must be a valid date',
    optional: true,
    test: (v) => typeof v === 'string' && validator.isISO8601(v),
  },
];

const loginRules = [
  {
    field: 'email',
    message: 'A valid email is required',
    test: (v) => isNonEmptyString(v) && validator.isEmail(v),
  },
  {
    field: 'password',
    message: 'Password is required',
    test: (v) => isNonEmptyString(v),
  },
];

module.exports = {
  validateEmployeeCreate: runRules(employeeRules({ optional: false })),
  validateEmployeeUpdate: runRules(employeeRules({ optional: true })),
  validateTaskCreate: runRules(taskRules({ optional: false, requireEmployee: true })),
  validateTaskUpdate: runRules(taskRules({ optional: true, requireEmployee: false })),
  validateLogin: runRules(loginRules),
};
