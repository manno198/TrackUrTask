const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { login } = require('./middleware/auth');
const { validateLogin } = require('./middleware/validators');
const { sequelize } = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — only the deployed frontend (and any extra origins listed in
// CORS_ORIGINS, e.g. for local dev) are allowed. Never falls back to '*':
// an unset origin means "allow nothing" rather than "allow everything."
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));

// Custom logger middleware
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TrackUrTask Employee Task Tracker API',
    version: '1.0.0',
  });
});

// Health check (for load balancers)
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// Auth route (bonus feature)
app.post('/api/auth/login', validateLogin, login);

// API Routes
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
