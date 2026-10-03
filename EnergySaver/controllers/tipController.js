const Tip = require('../models/Tip');

// Get all tips
const getTips = async (req, res) => {
    try {
        const tips = await Tip.find().sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: 'Tips fetched', data: tips });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create tip (admin only)
const createTip = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const tip = await Tip.create({ title, description, category, createdBy: req.user._id });

        res.status(201).json({ success: true, message: 'Tip created successfully', data: tip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTips, createTip };
