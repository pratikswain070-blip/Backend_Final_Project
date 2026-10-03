const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    default: null,
  },
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  percentageUsed: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['warning', 'exceeded'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', alertSchema);
