const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite database file path (in project root)
const dbPath = path.join(__dirname, '../../database.sqlite');

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: false,
  },
});

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connected successfully');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
