const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    default: null, // null means limit applies to entire home
  },
  limitType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  },
  limitValue: {
    type: Number,
    required: true,
  },
  currentUsage: {
    type: Number,
    default: 0,
  },
  alertPercentage: {
    type: Number,
    default: 90,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Limit', limitSchema);
