const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const standardRateLimitHandler = (req, res) => {
  return res.status(429).json({
    error: {
      message: 'Too many requests. Please try again later.',
      code: 'TOO_MANY_REQUESTS'
    }
  });
};

const linkCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 1000 : 100, // max 100 link creations per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: standardRateLimitHandler
});

const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isTest ? 5000 : 300, // 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: standardRateLimitHandler
});

module.exports = {
  linkCreateLimiter,
  redirectLimiter,
  standardRateLimitHandler
};
