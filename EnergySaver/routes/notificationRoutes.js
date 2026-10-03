const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/notifications/send
router.post('/send', authMiddleware, sendNotification);

module.exports = router;
