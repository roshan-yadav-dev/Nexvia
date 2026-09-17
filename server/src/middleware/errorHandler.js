const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const code = err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 409 ? 'CONFLICT' : statusCode === 429 ? 'TOO_MANY_REQUESTS' : 'SERVER_ERROR');
  const message = err.message || 'An unexpected error occurred';

  if (process.env.NODE_ENV !== 'test' && statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  return res.status(statusCode).json({
    error: {
      message,
      code,
      ...(err.details ? { details: err.details } : {})
    }
  });
};

module.exports = errorHandler;
