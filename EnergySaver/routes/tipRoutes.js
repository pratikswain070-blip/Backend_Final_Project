const express = require('express');
const router = express.Router();
const { getTips, createTip } = require('../controllers/tipController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/tips - Anyone logged in can see tips
router.get('/', authMiddleware, getTips);

// POST /api/tips - Only admin can create tips
router.post('/', authMiddleware, roleMiddleware('admin'), createTip);

module.exports = router;
