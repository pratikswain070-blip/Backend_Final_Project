// Send push notification
const sendNotification = async (req, res) => {
    try {
        const { token, title, message } = req.body;

        if (!token || !title || !message) {
            return res.status(400).json({ success: false, message: 'Token, title and message are required' });
        }

        console.log(`[Notification] Sent to device ${token}: ${title} - ${message}`);

        res.status(200).json({
            success: true,
            message: 'Push notification sent successfully',
            data: {
                token,
                title,
                message,
                sentAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sendNotification };
