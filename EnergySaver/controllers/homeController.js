const Home = require('../models/Home');

// Get all homes
const getHomes = async (req, res) => {
    try {
        const homes = await Home.find({ user: req.user._id });

        res.status(200).json({ success: true, message: 'Homes fetched', data: homes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single home
const getHomeById = async (req, res) => {
    try {
        const home = await Home.findOne({ _id: req.params.id, user: req.user._id });

        if (!home) {
            return res.status(404).json({ success: false, message: 'Home not found' });
        }

        res.status(200).json({ success: true, data: home });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create home
const createHome = async (req, res) => {
    try {
        const { name, address, city, neighborhood } = req.body;

        const home = await Home.create({ name, address, city, neighborhood, user: req.user._id });

        res.status(201).json({ success: true, message: 'Home created successfully', data: home });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update home
const updateHome = async (req, res) => {
    try {
        const { name, address, city, neighborhood } = req.body;

        const home = await Home.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { name, address, city, neighborhood },
            { new: true, runValidators: true }
        );

        if (!home) {
            return res.status(404).json({ success: false, message: 'Home not found' });
        }

        res.status(200).json({ success: true, message: 'Home updated successfully', data: home });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getHomes, getHomeById, createHome, updateHome };
