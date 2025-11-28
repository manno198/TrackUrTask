const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const validator = require('validator');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Employee name is required',
      },
      len: {
        args: [2, 100],
        msg: 'Name must be between 2 and 100 characters',
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Employee role is required',
      },
      len: {
        args: [1, 100],
        msg: 'Role cannot exceed 100 characters',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Email is required',
      },
      isEmail: {
        msg: 'Please provide a valid email address',
      },
    },
    set(value) {
      // Automatically convert email to lowercase
      this.setDataValue('email', value ? value.toLowerCase() : value);
    },
  },
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Employee;
