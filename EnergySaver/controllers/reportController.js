const Home = require('../models/Home');
const Device = require('../models/Device');
const Reading = require('../models/Reading');
const Limit = require('../models/Limit');

// Monthly report
const getMonthlyReport = async (req, res) => {
    try {
        const homes = await Home.find({ user: req.user._id });
        const devices = await Device.find({ home: { $in: homes.map(h => h._id) } });
        const deviceIds = devices.map(d => d._id);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Current month readings
        const currentReadings = await Reading.find({ device: { $in: deviceIds }, timestamp: { $gte: startOfMonth } });

        // Previous month readings
        const prevReadings = await Reading.find({ device: { $in: deviceIds }, timestamp: { $gte: startOfPrevMonth, $lt: startOfMonth } });

        // Total of current month
        let totalUsage = 0;
        for (const r of currentReadings) {
            totalUsage = totalUsage + r.energyConsumed;
        }

        // Total of previous month
        let previousMonthUsage = 0;
        for (const r of prevReadings) {
            previousMonthUsage = previousMonthUsage + r.energyConsumed;
        }

        // Usage of each device in current month
        const consumptionByDevice = [];
        for (const dev of devices) {
            let usage = 0;
            for (const r of currentReadings) {
                if (r.device.toString() === dev._id.toString()) {
                    usage = usage + r.energyConsumed;
                }
            }
            if (usage > 0) {
                consumptionByDevice.push({
                    deviceId: dev._id,
                    name: dev.name,
                    type: dev.type,
                    usage: parseFloat(usage.toFixed(2))
                });
            }
        }

        // Find highest consuming device
        let highestConsumer = 'N/A';
        let maxUsage = 0;
        for (const item of consumptionByDevice) {
            if (item.usage > maxUsage) {
                maxUsage = item.usage;
                highestConsumer = item.name;
            }
        }

        // Get monthly limit
        const limit = await Limit.findOne({ user: req.user._id, limitType: 'monthly', active: true });
        const monthlyLimit = limit ? limit.limitValue : 0;
        const daysPassed = now.getDate();

        res.status(200).json({
            success: true,
            message: 'Monthly report generated',
            data: {
                month: now.toLocaleString('default', { month: 'long' }),
                year: now.getFullYear(),
                totalUsage: parseFloat(totalUsage.toFixed(2)),
                monthlyLimit,
                limitUsedPercentage: monthlyLimit > 0 ? parseFloat(((totalUsage / monthlyLimit) * 100).toFixed(2)) : 0,
                highestConsumer,
                averageDailyUsage: daysPassed > 0 ? parseFloat((totalUsage / daysPassed).toFixed(2)) : 0,
                consumptionByDevice,
                previousMonthUsage: parseFloat(previousMonthUsage.toFixed(2))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Savings report
const getSavingsReport = async (req, res) => {
    try {
        const homes = await Home.find({ user: req.user._id });
        const devices = await Device.find({ home: { $in: homes.map(h => h._id) } });
        const deviceIds = devices.map(d => d._id);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentReadings = await Reading.find({ device: { $in: deviceIds }, timestamp: { $gte: startOfMonth } });
        const prevReadings = await Reading.find({ device: { $in: deviceIds }, timestamp: { $gte: startOfPrevMonth, $lt: startOfMonth } });

        let currentMonthUsage = 0;
        for (const r of currentReadings) {
            currentMonthUsage = currentMonthUsage + r.energyConsumed;
        }

        let previousMonthUsage = 0;
        for (const r of prevReadings) {
            previousMonthUsage = previousMonthUsage + r.energyConsumed;
        }

        const savedEnergy = previousMonthUsage - currentMonthUsage;
        const savingPercentage = previousMonthUsage > 0 ? (savedEnergy / previousMonthUsage) * 100 : 0;

        res.status(200).json({
            success: true,
            message: 'Savings report generated',
            data: {
                currentMonthUsage: parseFloat(currentMonthUsage.toFixed(2)),
                previousMonthUsage: parseFloat(previousMonthUsage.toFixed(2)),
                savedEnergy: parseFloat(savedEnergy.toFixed(2)),
                savingPercentage: parseFloat(savingPercentage.toFixed(2)),
                message: savedEnergy > 0
                    ? `Great! You saved ${savedEnergy.toFixed(2)} kWh this month.`
                    : 'You used more energy this month compared to last month.'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getMonthlyReport, getSavingsReport };
