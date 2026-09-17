const mongoose = require('mongoose');
const Link = require('../models/Link');
const Click = require('../models/Click');

const getLinkAnalytics = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(linkId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid link ID format',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const link = await Link.findOne({ _id: linkId, userId });
    if (!link) {
      return res.status(404).json({
        error: {
          message: 'Link not found or access denied',
          code: 'NOT_FOUND'
        }
      });
    }

    const objectId = new mongoose.Types.ObjectId(linkId);

    // 1. Clicks Over Time (Daily buckets)
    const clicksOverTime = await Click.aggregate([
      { $match: { linkId: objectId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", clicks: 1, _id: 0 } }
    ]);

    // 2. Top Referrers
    const topReferrers = await Click.aggregate([
      { $match: { linkId: objectId } },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { referrer: "$_id", count: 1, _id: 0 } }
    ]);

    // 3. Device Distribution
    const deviceDistribution = await Click.aggregate([
      { $match: { linkId: objectId } },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $project: { device: "$_id", count: 1, _id: 0 } }
    ]);

    // 4. Totals and Unique Visitors
    const totalClicks = await Click.countDocuments({ linkId: objectId });
    const uniqueIps = await Click.distinct('ipHash', { linkId: objectId });

    return res.status(200).json({
      link: {
        id: link._id,
        shortCode: link.shortCode,
        destinationUrl: link.destinationUrl,
        title: link.title,
        createdAt: link.createdAt
      },
      metrics: {
        totalClicks,
        uniqueVisitors: uniqueIps.length
      },
      clicksOverTime,
      topReferrers,
      deviceDistribution
    });
  } catch (error) {
    next(error);
  }
};

const getOverviewAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const userLinks = await Link.find({ userId }).select('_id shortCode title destinationUrl createdAt').lean();
    const linkIds = userLinks.map(l => l._id);

    if (linkIds.length === 0) {
      return res.status(200).json({
        totalLinks: 0,
        totalClicks: 0,
        uniqueVisitors: 0,
        clicksOverTime: [],
        topReferrers: [],
        deviceDistribution: [],
        topLinks: []
      });
    }

    // 1. Clicks Over Time across all links
    const clicksOverTime = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", clicks: 1, _id: 0 } }
    ]);

    // 2. Top Referrers
    const topReferrers = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { referrer: "$_id", count: 1, _id: 0 } }
    ]);

    // 3. Device Distribution
    const deviceDistribution = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $project: { device: "$_id", count: 1, _id: 0 } }
    ]);

    // 4. Click counts per link for Top Performing Links
    const linkClickAgg = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      {
        $group: {
          _id: "$linkId",
          clicks: { $sum: 1 }
        }
      },
      { $sort: { clicks: -1 } },
      { $limit: 5 }
    ]);

    const linkMap = {};
    userLinks.forEach(l => {
      linkMap[l._id.toString()] = l;
    });

    const topLinks = linkClickAgg.map(item => ({
      linkId: item._id,
      clicks: item.clicks,
      ...(linkMap[item._id.toString()] || {})
    }));

    const totalClicks = await Click.countDocuments({ linkId: { $in: linkIds } });
    const uniqueIps = await Click.distinct('ipHash', { linkId: { $in: linkIds } });

    return res.status(200).json({
      totalLinks: userLinks.length,
      totalClicks,
      uniqueVisitors: uniqueIps.length,
      clicksOverTime,
      topReferrers,
      deviceDistribution,
      topLinks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLinkAnalytics,
  getOverviewAnalytics
};
