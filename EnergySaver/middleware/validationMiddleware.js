const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    next();
};

// Registration rules
const registerRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Login rules
const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Home rules
const homeRules = [
    body('name').notEmpty().withMessage('Home name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('neighborhood').notEmpty().withMessage('Neighborhood is required')
];

// Device rules
const deviceRules = [
    body('home').notEmpty().withMessage('Home ID is required'),
    body('name').notEmpty().withMessage('Device name is required'),
    body('type').notEmpty().withMessage('Device type is required'),
    body('powerRating').isNumeric().withMessage('Power rating must be a number')
];

// Reading rules
const readingRules = [
    body('device').notEmpty().withMessage('Device ID is required'),
    body('energyConsumed').isNumeric().withMessage('Energy consumed must be a number')
];

// Limit rules
const limitRules = [
    body('home').notEmpty().withMessage('Home ID is required'),
    body('limitType').isIn(['daily', 'weekly', 'monthly']).withMessage('Limit type must be daily, weekly or monthly'),
    body('limitValue').isNumeric().withMessage('Limit value must be a number')
];

// Validate MongoDB ObjectId
const validateObjectId = (paramName) => {
    return param(paramName).custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid ID format');
        }
        return true;
    });
};

module.exports = { validate, registerRules, loginRules, homeRules, deviceRules, readingRules, limitRules, validateObjectId };
