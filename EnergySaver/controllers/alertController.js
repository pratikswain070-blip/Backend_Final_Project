const Alert = require('../models/Alert');
const Limit = require('../models/Limit');
const Reading = require('../models/Reading');
const Device = require('../models/Device');

// Get all alerts
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user._id })
            .populate('home', 'name')
            .populate('device', 'name type')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: 'Alerts fetched', data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check limits and generate alerts
const checkAlerts = async (req, res) => {
    try {
        const limits = await Limit.find({ user: req.user._id, active: true });
        const alertsCreated = [];
        const now = new Date();

        for (const limit of limits) {
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
                : (await Device.find({ home: limit.home })).map(d => d._id);

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
                    home: limit.home,
                    type: alertType,
                    createdAt: { $gte: startDate }
                });

                if (!existingAlert) {
                    const message = `${alertType.toUpperCase()}: ${percentage.toFixed(1)}% of ${limit.limitType} limit used (${total.toFixed(1)}/${limit.limitValue} kWh)`;

                    const alert = await Alert.create({
                        user: req.user._id,
                        device: limit.device,
                        home: limit.home,
                        message,
                        percentageUsed: percentage,
                        type: alertType
                    });

                    alertsCreated.push(alert);

                    const io = req.app.get('io');
                    if (io) {
                        io.to(limit.home.toString()).emit('energyAlert', {
                            type: alertType,
                            message,
                            percentageUsed: percentage
                        });
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Check complete. ${alertsCreated.length} alert(s) created`,
            data: alertsCreated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAlerts, checkAlerts };
