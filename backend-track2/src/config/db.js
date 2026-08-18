const { Sequelize } = require('sequelize');
const config = require('./database')[process.env.NODE_ENV || 'development'];

if (!config.url) {
  console.error(
    'DATABASE_URL is not set. Copy .env.example to .env and set DATABASE_URL to a Postgres connection string.'
  );
  process.exit(1);
}

const sequelize = new Sequelize(config.url, {
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,
  logging: false,
  define: config.define,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
