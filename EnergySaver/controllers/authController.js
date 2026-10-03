const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login };
