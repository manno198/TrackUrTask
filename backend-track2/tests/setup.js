process.env.NODE_ENV = 'test';
require('dotenv').config();

const { sequelize } = require('../src/models');

const resetDb = async () => {
  await sequelize.sync({ force: true });
};

module.exports = { sequelize, resetDb };
