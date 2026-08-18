const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.isAppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({
      success: false,
      error: errors.map((e) => e.message).join(', '),
      errors,
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: `${e.path} already exists` }));
    return res.status(400).json({
      success: false,
      error: errors.map((e) => e.message).join(', '),
      errors,
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Referenced resource does not exist',
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
