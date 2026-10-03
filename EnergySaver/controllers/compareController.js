const Home = require('../models/Home');
const Device = require('../models/Device');
const Reading = require('../models/Reading');

// Compare with neighborhood
const compareNeighborhood = async (req, res) => {
    try {
        const userHomes = await Home.find({ user: req.user._id });

        if (userHomes.length === 0) {
            return res.status(404).json({ success: false, message: 'No homes found' });
        }

        const userHome = userHomes[0];
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // Get user's usage
        const userDevices = await Device.find({ home: userHome._id });
        const userDeviceIds = userDevices.map(d => d._id);

        const userReadings = await Reading.find({ device: { $in: userDeviceIds }, timestamp: { $gte: startOfMonth } });

        let yourUsage = 0;
        for (const r of userReadings) {
            yourUsage = yourUsage + r.energyConsumed;
        }

        // Get neighborhood usage
        const neighborHomes = await Home.find({ neighborhood: userHome.neighborhood });
        const neighborDevices = await Device.find({ home: { $in: neighborHomes.map(h => h._id) } });

        const neighborReadings = await Reading.find({ device: { $in: neighborDevices.map(d => d._id) }, timestamp: { $gte: startOfMonth } });

        let neighborTotal = 0;
        for (const r of neighborReadings) {
            neighborTotal = neighborTotal + r.energyConsumed;
        }
        const neighborhoodAverage = neighborHomes.length > 0 ? neighborTotal / neighborHomes.length : 0;
        const difference = yourUsage - neighborhoodAverage;

        let message;
        if (difference < 0) message = 'Great! Your usage is below the neighborhood average.';
        else if (difference === 0) message = 'Your usage is equal to the neighborhood average.';
        else message = 'Your usage is above the neighborhood average. Consider saving energy!';

        res.status(200).json({
            success: true,
            data: {
                yourUsage: parseFloat(yourUsage.toFixed(2)),
                neighborhoodAverage: parseFloat(neighborhoodAverage.toFixed(2)),
                difference: parseFloat(difference.toFixed(2)),
                neighborhood: userHome.neighborhood,
                totalHomesInNeighborhood: neighborHomes.length,
                message
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get average consumption
const getAverage = async (req, res) => {
    try {
        const homes = await Home.find({ user: req.user._id });
        const devices = await Device.find({ home: { $in: homes.map(h => h._id) } });
        const deviceIds = devices.map(d => d._id);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const readings = await Reading.find({ device: { $in: deviceIds }, timestamp: { $gte: startOfMonth } });

        let totalUsage = 0;
        for (const r of readings) {
            totalUsage = totalUsage + r.energyConsumed;
        }
        const daysPassed = now.getDate();

        res.status(200).json({
            success: true,
            data: {
                totalUsage: parseFloat(totalUsage.toFixed(2)),
                averageDailyUsage: parseFloat((daysPassed > 0 ? totalUsage / daysPassed : 0).toFixed(2)),
                daysPassed
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { compareNeighborhood, getAverage };
