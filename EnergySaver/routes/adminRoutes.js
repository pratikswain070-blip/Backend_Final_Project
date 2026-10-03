const express = require('express');
const router = express.Router();
const { getAllDevices, getTemplates, createTemplate } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// GET /api/admin/devices - View all devices across all homes
router.get('/devices', getAllDevices);

// GET /api/admin/templates - View device templates
router.get('/templates', getTemplates);

// POST /api/admin/templates - Create device template
router.post('/templates', createTemplate);

module.exports = router;
