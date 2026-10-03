const express = require('express');
const router = express.Router();
const {
  createLimit,
  getLimits,
  getLimitsByDevice,
  updateLimit,
} = require('../controllers/limitController');
const authMiddleware = require('../middleware/authMiddleware');
const { limitRules, validate } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

// POST /api/limits - Set energy usage limit
router.post('/', limitRules, validate, createLimit);

// GET /api/limits - View energy usage limits
router.get('/', getLimits);

// GET /api/limits/device/:id - View limits for a specific device
router.get('/device/:id', getLimitsByDevice);

// PUT /api/limits/:id - Update limit
router.put('/:id', updateLimit);

module.exports = router;
