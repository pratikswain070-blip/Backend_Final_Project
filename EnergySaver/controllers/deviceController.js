const Device = require('../models/Device');
const Home = require('../models/Home');

// Get all devices
const getDevices = async (req, res) => {
    try {
        const homes = await Home.find({ user: req.user._id });
        const homeIds = homes.map(h => h._id);

        const devices = await Device.find({ home: { $in: homeIds } }).populate('home', 'name');

        res.status(200).json({ success: true, message: 'Devices fetched', data: devices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single device
const getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id).populate('home', 'name user');

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        if (device.home.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.status(200).json({ success: true, data: device });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create device
const createDevice = async (req, res) => {
    try {
        const { home, name, type, brand, powerRating } = req.body;

        const homeDoc = await Home.findOne({ _id: home, user: req.user._id });
        if (!homeDoc) {
            return res.status(403).json({ success: false, message: 'You do not own this home' });
        }

        const device = await Device.create({ home, name, type, brand, powerRating });

        res.status(201).json({ success: true, message: 'Device added successfully', data: device });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update device
const updateDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id).populate('home', 'user');

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        if (device.home.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { name, type, brand, powerRating, status } = req.body;
        const updated = await Device.findByIdAndUpdate(
            req.params.id,
            { name, type, brand, powerRating, status },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: 'Device updated successfully', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete device
const deleteDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id).populate('home', 'user');

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        if (device.home.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await Device.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDevices, getDeviceById, createDevice, updateDevice, deleteDevice };
