const Reading = require('../models/Reading');
const Device = require('../models/Device');
const Home = require('../models/Home');
const Limit = require('../models/Limit');
const Alert = require('../models/Alert');

// Create reading
const createReading = async (req, res) => {
    try {
        const { device, energyConsumed, voltage, current, timestamp } = req.body;

        const deviceDoc = await Device.findById(device).populate('home', 'user');
        if (!deviceDoc) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        if (deviceDoc.home.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const reading = await Reading.create({
            device,
            energyConsumed,
            voltage: voltage || 230,
            current: current || 0,
            timestamp: timestamp || Date.now()
        });

        // Emit real-time update via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.to(deviceDoc.home._id.toString()).emit('energyUpdate', {
                deviceId: device,
                deviceName: deviceDoc.name,
                energyConsumed,
                timestamp: reading.timestamp
            });
        }

        // Check limits and create alerts if needed
        const limits = await Limit.find({
            user: req.user._id,
            home: deviceDoc.home._id,
            active: true
        });

        for (const limit of limits) {
            const now = new Date();
            let startDate;

            if (limit.limitType === 'daily') {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            } else if (limit.limitType === 'weekly') {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            } else {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            const deviceIds = limit.device
                ? [limit.device]
                : (await Device.find({ home: deviceDoc.home._id })).map(d => d._id);

            // Get readings in this period and add them up
            const periodReadings = await Reading.find({ device: { $in: deviceIds }, timestamp: { $gte: startDate } });

            let total = 0;
            for (const r of periodReadings) {
                total = total + r.energyConsumed;
            }
            const percentage = (total / limit.limitValue) * 100;

            await Limit.findByIdAndUpdate(limit._id, { currentUsage: total });

            let alertType = null;
            if (percentage >= 100) alertType = 'exceeded';
            else if (percentage >= limit.alertPercentage) alertType = 'warning';

            if (alertType) {
                const existingAlert = await Alert.findOne({
                    user: req.user._id,
                    home: deviceDoc.home._id,
                    type: alertType,
                    createdAt: { $gte: startDate }
                });

                if (!existingAlert) {
                    const message = `${alertType === 'warning' ? 'Warning' : 'Alert'}: ${percentage.toFixed(1)}% of ${limit.limitType} limit reached (${total.toFixed(1)}/${limit.limitValue} kWh)`;

                    await Alert.create({
                        user: req.user._id,
                        device: limit.device,
                        home: deviceDoc.home._id,
                        message,
                        percentageUsed: percentage,
                        type: alertType
                    });

                    if (io) {
                        io.to(deviceDoc.home._id.toString()).emit('energyAlert', {
                            type: alertType,
                            message,
                            percentageUsed: percentage
                        });
                    }
                }
            }
        }

        res.status(201).json({ success: true, message: 'Reading recorded successfully', data: reading });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all readings
const getReadings = async (req, res) => {
    try {
        const homes = await Home.find({ user: req.user._id });
        const homeIds = homes.map(h => h._id);
        const devices = await Device.find({ home: { $in: homeIds } });
        const deviceIds = devices.map(d => d._id);

        const readings = await Reading.find({ device: { $in: deviceIds } })
            .populate('device', 'name type home')
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({ success: true, message: 'Readings fetched', data: readings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get readings by device
const getReadingsByDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id).populate('home', 'user');

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        if (device.home.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const readings = await Reading.find({ device: req.params.id })
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({ success: true, message: 'Device readings fetched', data: readings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createReading, getReadings, getReadingsByDevice };
