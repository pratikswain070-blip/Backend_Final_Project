const Device = require('../models/Device');
const DeviceTemplate = require('../models/DeviceTemplate');

// Get all devices (admin)
const getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find().populate('home', 'name address');

        res.status(200).json({ success: true, message: 'All devices fetched', data: devices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get device templates
const getTemplates = async (req, res) => {
    try {
        const templates = await DeviceTemplate.find();

        res.status(200).json({ success: true, message: 'Device templates fetched', data: templates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create device template
const createTemplate = async (req, res) => {
    try {
        const { name, type, defaultPowerRating, description } = req.body;

        const template = await DeviceTemplate.create({ name, type, defaultPowerRating, description });

        res.status(201).json({ success: true, message: 'Device template created', data: template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllDevices, getTemplates, createTemplate };
