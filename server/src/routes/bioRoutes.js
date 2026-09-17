const express = require('express');
const { z } = require('zod');
const bioController = require('../controllers/bioController');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');

const router = express.Router();

const socialLinkItemSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  title: z.string().optional(),
  url: z.string().min(1, 'URL is required'),
  order: z.number().optional()
});

const projectItemSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  year: z.string().optional(),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  caseStudy: z.string().optional(),
  order: z.number().optional()
});

const experienceItemSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  year: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional()
});

const upsertBioSchema = z.object({
  body: z.object({
    avatarUrl: z.string().optional(),
    displayName: z.string().max(60, 'Display name maximum length is 60 characters').optional(),
    headline: z.string().max(120, 'Headline maximum length is 120 characters').optional(),
    bio: z.string().max(500, 'Bio maximum length is 500 characters').optional(),
    theme: z.enum(['minimal-light', 'dark-slate', 'gradient', 'warm-cream', 'nexvia-editorial']).default('dark-slate'),
    socialLinks: z.array(socialLinkItemSchema).optional(),
    projects: z.array(projectItemSchema).optional(),
    experience: z.array(experienceItemSchema).optional()
  })
});

// Authenticated Routes
router.get('/me', requireAuth, bioController.getOwnProfile);
router.post('/', requireAuth, validate(upsertBioSchema), bioController.upsertProfile);
router.put('/', requireAuth, validate(upsertBioSchema), bioController.upsertProfile);

// Public Profile Route
router.get('/:username', bioController.getPublicProfile);

module.exports = router;
