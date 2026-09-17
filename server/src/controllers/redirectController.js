const UAParser = require('ua-parser-js');
const Link = require('../models/Link');
const Click = require('../models/Click');
const { generateIpHash } = require('../utils/ipHash');

const parseDeviceType = (userAgentString) => {
  if (!userAgentString) return 'Desktop';
  const parser = new UAParser(userAgentString);
  const device = parser.getDevice();
  const rawType = device.type; // 'mobile', 'tablet', undefined, etc.

  if (rawType === 'mobile') return 'Mobile';
  if (rawType === 'tablet') return 'Tablet';
  return 'Desktop';
};

const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({ shortCode: shortCode.trim() });

    if (!link || !link.isActive) {
      return res.status(404).json({
        error: {
          message: 'Short link not found or has been deactivated',
          code: 'NOT_FOUND'
        }
      });
    }

    // 1. Immediately perform 302 Redirect
    res.redirect(302, link.destinationUrl);

    // 2. Fire-and-forget Click Logging (asynchronous, unblocked)
    setImmediate(async () => {
      try {
        const userAgent = req.headers['user-agent'] || '';
        const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct / None';
        const deviceType = parseDeviceType(userAgent);
        const ipHash = generateIpHash(req);

        await Click.create({
          linkId: link._id,
          timestamp: new Date(),
          referrer,
          deviceType,
          ipHash
        });
      } catch (logErr) {
        // Non-blocking catch
        console.error('Async click logging failed:', logErr.message);
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRedirect,
  parseDeviceType
};
