const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['AC', 'Fan', 'Refrigerator', 'Washing Machine', 'TV', 'Light', 'Heater', 'Geyser', 'EV Charger', 'Microwave', 'Other'],
  },
  brand: {
    type: String,
    default: '',
  },
  powerRating: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['on', 'off'],
    default: 'off',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Device', deviceSchema);
