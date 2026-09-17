const express = require('express');
const redirectController = require('../controllers/redirectController');
const { redirectLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.get('/:shortCode', redirectLimiter, redirectController.handleRedirect);

module.exports = router;
