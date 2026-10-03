// Centralized error handling
const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err.message);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
    }

    if (err.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate value entered' });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server Error' });
};

module.exports = errorMiddleware;
