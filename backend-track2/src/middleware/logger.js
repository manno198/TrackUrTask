const logger = (req, res, next) => {
  const start = Date.now();

  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`;
    
    // Color code based on status
    if (res.statusCode >= 500) {
      console.error(`\x1b[31m${logMessage}\x1b[0m`); // Red for server errors
    } else if (res.statusCode >= 400) {
      console.warn(`\x1b[33m${logMessage}\x1b[0m`); // Yellow for client errors
    } else {
      console.log(`\x1b[32m${logMessage}\x1b[0m`); // Green for success
    }
  });

  next();
};

module.exports = logger;
