const express = require('express');
const router = express.Router();
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');
const { deviceRules, validate } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

// GET /api/devices - View smart devices
router.get('/', getDevices);

// GET /api/devices/:id - View single device
router.get('/:id', getDeviceById);

// POST /api/devices - Add smart device to home
router.post('/', deviceRules, validate, createDevice);

// PUT /api/devices/:id - Update device
router.put('/:id', updateDevice);

// DELETE /api/devices/:id - Delete device
router.delete('/:id', deleteDevice);

module.exports = router;
