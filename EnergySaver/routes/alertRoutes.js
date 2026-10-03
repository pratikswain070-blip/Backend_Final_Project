const express = require('express');
const router = express.Router();
const { getAlerts, checkAlerts } = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/alerts - View alerts generated when limits are reached
router.get('/', getAlerts);

// POST /api/alerts/check - Manually check limits and generate alerts
router.post('/check', checkAlerts);

module.exports = router;
