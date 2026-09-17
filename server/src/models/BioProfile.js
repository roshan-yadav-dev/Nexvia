const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  technologies: [{
    type: String,
    trim: true
  }],
  year: {
    type: String,
    trim: true,
    default: ''
  },
  url: {
    type: String,
    trim: true,
    default: ''
  },
  githubUrl: {
    type: String,
    trim: true,
    default: ''
  },
  caseStudy: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const bioProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  displayName: {
    type: String,
    trim: true,
    default: ''
  },
  headline: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  theme: {
    type: String,
    enum: ['minimal-light', 'dark-slate', 'gradient', 'warm-cream', 'nexvia-editorial'],
    default: 'dark-slate'
  },
  socialLinks: [socialLinkSchema],
  projects: [projectSchema],
  experience: [experienceSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bioProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('BioProfile', bioProfileSchema);
