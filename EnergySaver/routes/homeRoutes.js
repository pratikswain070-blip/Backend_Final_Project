const express = require('express');
const router = express.Router();
const { getHomes, getHomeById, createHome, updateHome } = require('../controllers/homeController');
const authMiddleware = require('../middleware/authMiddleware');
const { homeRules, validate } = require('../middleware/validationMiddleware');

// All home routes require authentication
router.use(authMiddleware);

// GET /api/homes - View registered homes
router.get('/', getHomes);

// GET /api/homes/:id - View single home
router.get('/:id', getHomeById);

// POST /api/homes - Register a home
router.post('/', homeRules, validate, createHome);

// PUT /api/homes/:id - Update a home
router.put('/:id', updateHome);

module.exports = router;
