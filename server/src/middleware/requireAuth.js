const { verifyAccessToken } = require('../utils/tokenService');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        message: 'Authentication token is required',
        code: 'UNAUTHORIZED'
      }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Access token expired',
          code: 'TOKEN_EXPIRED'
        }
      });
    }

    return res.status(401).json({
      error: {
        message: 'Invalid or malformed authentication token',
        code: 'UNAUTHORIZED'
      }
    });
  }
};

module.exports = requireAuth;
