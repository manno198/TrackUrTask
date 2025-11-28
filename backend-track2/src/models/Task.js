const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Task title is required',
      },
      len: {
        args: [3, 200],
        msg: 'Title must be between 3 and 200 characters',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Description cannot exceed 1000 characters',
      },
    },
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Pending',
    validate: {
      isIn: {
        args: [['Pending', 'In Progress', 'Completed']],
        msg: 'Status must be: Pending, In Progress, or Completed',
      },
    },
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
    validate: {
      isIn: {
        args: [['Low', 'Medium', 'High']],
        msg: 'Priority must be: Low, Medium, or High',
      },
    },
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: 'Task must be assigned to an employee',
      },
    },
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Task;
