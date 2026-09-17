const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
  getRefreshCookieOptions,
  getClearCookieOptions
} = require('../utils/tokenService');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');
const env = require('../config/env');

const signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Check unique constraints
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(409).json({
        error: {
          message: `${field} is already registered`,
          code: 'CONFLICT'
        }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new User({
      email: email.toLowerCase(),
      passwordHash,
      username: username.toLowerCase(),
      isVerified: false,
      verificationToken,
      verificationTokenExpiry
    });

    await user.save();

    const { verificationUrl } = await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      message: 'Registration successful! Please verify your email before logging in.',
      verificationToken: env.NODE_ENV !== 'production' ? verificationToken : undefined,
      devVerificationUrl: env.NODE_ENV !== 'production' ? verificationUrl : undefined
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        error: {
          message: 'Invalid or expired verification token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }]
    });

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: {
          message: 'Please verify your email address to continue',
          code: 'UNVERIFIED_EMAIL'
        }
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions,
  getClearCookieOptions());

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: {
          message: 'Refresh token cookie is missing',
          code: 'UNAUTHORIZED'
        }
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      res.clearCookie('refreshToken', getClearCookieOptions());
      return res.status(401).json({
        error: {
          message: 'Invalid or expired refresh token',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokenHash) {
      res.clearCookie('refreshToken', getClearCookieOptions());
      return res.status(401).json({
        error: {
          message: 'User session not found',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Verify hash
    const incomingHash = hashToken(refreshToken);
    if (incomingHash !== user.refreshTokenHash) {
      // Possible reuse detected: invalidate session
      user.refreshTokenHash = undefined;
      await user.save();
      res.clearCookie('refreshToken', getClearCookieOptions());
      return res.status(401).json({
        error: {
          message: 'Refresh token invalid or already used',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions,
  getClearCookieOptions());

    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        await User.findByIdAndUpdate(decoded.userId, {
          $unset: { refreshTokenHash: 1 }
        });
      } catch (err) {
        // Token might already be invalid, still proceed with clearing cookie
      }
    }

    res.clearCookie('refreshToken', getClearCookieOptions());

    return res.status(200).json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return 200 to prevent user enumeration
      return res.status(200).json({
        message: 'If an account exists with that email, a password reset link has been dispatched.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const { resetUrl } = await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({
      message: 'If an account exists with that email, a password reset link has been dispatched.',
      devResetUrl: env.NODE_ENV !== 'production' ? resetUrl : undefined,
      resetToken: env.NODE_ENV !== 'production' ? resetToken : undefined
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        error: {
          message: 'Invalid or expired password reset token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    // Invalidate existing refresh sessions
    user.refreshTokenHash = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -refreshTokenHash');
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User profile not found',
          code: 'NOT_FOUND'
        }
      });
    }

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe
};
