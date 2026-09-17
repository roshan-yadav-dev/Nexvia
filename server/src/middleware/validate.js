const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (err) {
    const errorDetails = err.errors ? err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) : err.message;

    return res.status(400).json({
      error: {
        message: err.errors && err.errors[0] ? err.errors[0].message : 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errorDetails
      }
    });
  }
};

module.exports = validate;
