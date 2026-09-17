const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  referrer: {
    type: String,
    default: 'Direct / None'
  },
  deviceType: {
    type: String,
    enum: ['Mobile', 'Desktop', 'Tablet', 'Other'],
    default: 'Desktop'
  },
  ipHash: {
    type: String,
    default: ''
  }
});

// Index for link-specific time series analytics queries
clickSchema.index({ linkId: 1, timestamp: -1 });

module.exports = mongoose.model('Click', clickSchema);
