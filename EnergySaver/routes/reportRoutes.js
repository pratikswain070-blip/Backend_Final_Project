const express = require('express');
const router = express.Router();
const { getMonthlyReport, getSavingsReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/reports/monthly - Generate monthly reports
router.get('/monthly', getMonthlyReport);

// GET /api/reports/savings - Generate savings report compared to last month
router.get('/savings', getSavingsReport);

module.exports = router;
