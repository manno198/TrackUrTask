const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { login } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Custom logger middleware
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ProU Employee Task Tracker API',
    version: '1.0.0',
  });
});

// Auth route (bonus feature)
app.post('/api/auth/login', login);

// API Routes
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
