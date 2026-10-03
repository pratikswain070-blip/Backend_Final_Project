const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  energyConsumed: {
    type: Number,
    required: true,
  },
  voltage: {
    type: Number,
    default: 230,
  },
  current: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reading', readingSchema);
