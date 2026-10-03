const mongoose = require('mongoose');

const deviceTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['AC', 'Fan', 'Refrigerator', 'Washing Machine', 'TV', 'Light', 'Heater', 'Geyser', 'EV Charger', 'Microwave', 'Other'],
  },
  defaultPowerRating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DeviceTemplate', deviceTemplateSchema);
