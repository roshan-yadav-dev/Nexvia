const crypto = require('crypto');
const env = require('../config/env');

const generateIpHash = (req) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
             req.ip ||
             req.socket?.remoteAddress ||
             '127.0.0.1';

  const salt = env.IP_HASH_SALT || 'nexvia_default_salt';
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex');
};

module.exports = {
  generateIpHash
};
