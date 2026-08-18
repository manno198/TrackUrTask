require('dotenv').config();

const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    `\x1b[31mMissing required environment variables: ${missingEnv.join(', ')}. Copy .env.example to .env and fill them in.\x1b[0m`
  );
  process.exit(1);
}

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`\x1b[36m%s\x1b[0m`, `Server running on port ${PORT}`);
      console.log(`\x1b[36m%s\x1b[0m`, `API: http://localhost:${PORT}/api`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`\x1b[31mUnhandled Rejection: ${err.message}\x1b[0m`);
      server.close(() => process.exit(1));
    });

    return server;
  } catch (error) {
    console.error(`\x1b[31mFailed to start server: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

startServer();
