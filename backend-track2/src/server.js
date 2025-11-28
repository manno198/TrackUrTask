require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to SQLite database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`\x1b[36m%s\x1b[0m`, `Server running on port ${PORT}`);
      console.log(`\x1b[36m%s\x1b[0m`, `API: http://localhost:${PORT}/api`);
    });
    
    return server;
  } catch (error) {
    console.error(`\x1b[31mFailed to start server: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\x1b[31mUnhandled Rejection: ${err.message}\x1b[0m`);
  server.close(() => process.exit(1));
});
