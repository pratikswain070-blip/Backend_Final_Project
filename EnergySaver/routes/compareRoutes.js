const express = require('express');
const router = express.Router();
const { compareNeighborhood, getAverage } = require('../controllers/compareController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/compare/neighborhood - Compare usage with neighborhood averages
router.get('/neighborhood', compareNeighborhood);

// GET /api/compare/average - Average consumption across user's homes
router.get('/average', getAverage);

module.exports = router;
