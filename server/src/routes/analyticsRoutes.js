const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/overview', analyticsController.getOverviewAnalytics);
router.get('/:linkId', analyticsController.getLinkAnalytics);

module.exports = router;
