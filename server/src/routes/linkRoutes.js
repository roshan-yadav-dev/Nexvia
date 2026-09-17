const express = require('express');
const { z } = require('zod');
const linkController = require('../controllers/linkController');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const { linkCreateLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const createLinkSchema = z.object({
  body: z.object({
    destinationUrl: z.string().min(1, 'Destination URL is required'),
    customAlias: z.string().max(40, 'Custom alias max length is 40').regex(/^[a-zA-Z0-9_-]*$/, 'Custom alias can only contain letters, numbers, hyphens, and underscores').optional(),
    title: z.string().max(100, 'Title max length is 100').optional()
  })
});

const updateLinkSchema = z.object({
  body: z.object({
    destinationUrl: z.string().min(1, 'Destination URL cannot be empty').optional(),
    title: z.string().max(100, 'Title max length is 100').optional()
  })
});

router.use(requireAuth);

router.post('/', linkCreateLimiter, validate(createLinkSchema), linkController.createLink);
router.get('/', linkController.getLinks);
router.patch('/:id', validate(updateLinkSchema), linkController.updateLink);
router.delete('/:id', linkController.deleteLink);
router.patch('/:id/toggle', linkController.toggleLink);

module.exports = router;
