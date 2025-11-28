const { sequelize } = require('../config/db');
const Employee = require('./Employee');
const Task = require('./Task');

// Define associations
// Employee hasMany Tasks
Employee.hasMany(Task, {
  foreignKey: 'employeeId',
  as: 'tasks',
  onDelete: 'CASCADE', // Delete tasks when employee is deleted
});

// Task belongsTo Employee
Task.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee',
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Employee,
  Task,
};

