const Limit = require('../models/Limit');
const Home = require('../models/Home');

// Create limit
const createLimit = async (req, res) => {
    try {
        const { home, device, limitType, limitValue, alertPercentage } = req.body;

        const homeDoc = await Home.findOne({ _id: home, user: req.user._id });
        if (!homeDoc) {
            return res.status(403).json({ success: false, message: 'You do not own this home' });
        }

        const limit = await Limit.create({
            home,
            device,
            limitType,
            limitValue,
            alertPercentage,
            user: req.user._id
        });

        res.status(201).json({ success: true, message: 'Limit created successfully', data: limit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all limits
const getLimits = async (req, res) => {
    try {
        const limits = await Limit.find({ user: req.user._id })
            .populate('home', 'name')
            .populate('device', 'name type');

        res.status(200).json({ success: true, message: 'Limits fetched', data: limits });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get limits by device
const getLimitsByDevice = async (req, res) => {
    try {
        const limits = await Limit.find({ user: req.user._id, device: req.params.id })
            .populate('home', 'name');

        res.status(200).json({ success: true, data: limits });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update limit
const updateLimit = async (req, res) => {
    try {
        const { limitType, limitValue, alertPercentage, active } = req.body;

        const limit = await Limit.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { limitType, limitValue, alertPercentage, active },
            { new: true, runValidators: true }
        );

        if (!limit) {
            return res.status(404).json({ success: false, message: 'Limit not found' });
        }

        res.status(200).json({ success: true, message: 'Limit updated successfully', data: limit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createLimit, getLimits, getLimitsByDevice, updateLimit };
