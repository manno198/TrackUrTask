require('dotenv').config();

const useSSL = process.env.DB_SSL === 'true';

const base = {
  dialect: 'postgres',
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  define: {
    timestamps: true,
    underscored: false,
  },
};

module.exports = {
  development: { ...base, url: process.env.DATABASE_URL },
  test: { ...base, url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL },
  production: { ...base, url: process.env.DATABASE_URL },
};
