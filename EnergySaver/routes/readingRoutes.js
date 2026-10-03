const express = require('express');
const router = express.Router();
const {
  createReading,
  getReadings,
  getReadingsByDevice,
} = require('../controllers/readingController');
const authMiddleware = require('../middleware/authMiddleware');
const { readingRules, validate } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

// POST /api/readings - Record energy consumption reading
router.post('/', readingRules, validate, createReading);

// GET /api/readings - View energy consumption readings
router.get('/', getReadings);

// GET /api/readings/device/:id - View readings for a specific device
router.get('/device/:id', getReadingsByDevice);

module.exports = router;
