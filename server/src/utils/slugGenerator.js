const { nanoid, customAlphabet } = require('nanoid');
const Link = require('../models/Link');

// Alphanumeric alphabet without easily confused characters (like 0/O, 1/l/I)
const generateCode = customAlphabet('23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 6);

const RESERVED_SLUGS = new Set([
  'api', 'auth', 'r', 'bio', 'admin', 'health', 'login', 'signup',
  'verify', 'forgot-password', 'reset-password', 'dashboard', 'links',
  'analytics', 'settings', 'null', 'undefined', 'static', 'assets'
]);

const isReservedSlug = (slug) => {
  return RESERVED_SLUGS.has(slug.toLowerCase());
};

const generateUniqueSlug = async () => {
  let attempts = 0;
  while (attempts < 10) {
    const slug = generateCode();
    if (isReservedSlug(slug)) {
      attempts++;
      continue;
    }
    const exists = await Link.findOne({ shortCode: slug });
    if (!exists) {
      return slug;
    }
    attempts++;
  }
  // Fallback if collision: 8 characters
  return customAlphabet('23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 8)();
};

module.exports = {
  generateUniqueSlug,
  isReservedSlug
};
