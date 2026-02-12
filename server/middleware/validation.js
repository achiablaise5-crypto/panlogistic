/**
 * Validation Middleware
 * Input validation for API requests
 */

const { validationResult, body } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    
    next();
};

/**
 * Booking validation rules
 */
const validateBooking = [
    body('senderName')
        .trim()
        .notEmpty()
        .withMessage('Sender name is required')
        .isLength({ max: 255 })
        .withMessage('Sender name must be less than 255 characters'),
    
    body('senderPhone')
        .trim()
        .notEmpty()
        .withMessage('Sender phone is required'),
    
    body('senderEmail')
        .trim()
        .notEmpty()
        .withMessage('Sender email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    
    body('senderAddress')
        .trim()
        .notEmpty()
        .withMessage('Sender address is required'),
    
    body('receiverName')
        .trim()
        .notEmpty()
        .withMessage('Receiver name is required'),
    
    body('receiverPhone')
        .trim()
        .notEmpty()
        .withMessage('Receiver phone is required'),
    
    body('receiverAddress')
        .trim()
        .notEmpty()
        .withMessage('Receiver address is required'),
    
    body('receiverCountry')
        .trim()
        .notEmpty()
        .withMessage('Receiver country is required'),
    
    body('shipmentType')
        .notEmpty()
        .withMessage('Shipment type is required')
        .isIn(['Air Freight', 'Sea Freight', 'Land Transport'])
        .withMessage('Invalid shipment type'),
    
    body('weight')
        .notEmpty()
        .withMessage('Weight is required')
        .isFloat({ min: 0.1 })
        .withMessage('Weight must be a positive number'),
    
    body('cargoType')
        .notEmpty()
        .withMessage('Cargo type is required'),
    
    body('pickupDate')
        .notEmpty()
        .withMessage('Pickup date is required')
        .isISO8601()
        .withMessage('Invalid pickup date format'),
    
    body('deliveryPriority')
        .notEmpty()
        .withMessage('Delivery priority is required')
        .isIn(['Standard', 'Express', 'Urgent'])
        .withMessage('Invalid priority'),
    
    handleValidationErrors
];

/**
 * Contact form validation rules
 */
const validateContact = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 255 })
        .withMessage('Name must be less than 255 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 5000 })
        .withMessage('Message must be less than 5000 characters'),
    
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Phone must be less than 50 characters'),
    
    body('subject')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Subject must be less than 255 characters'),
    
    handleValidationErrors
];

/**
 * Login validation rules
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

/**
 * Register validation rules
 */
const validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 255 })
        .withMessage('Name must be less than 255 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    
    body('role')
        .optional()
        .isIn(['admin', 'staff'])
        .withMessage('Role must be admin or staff'),
    
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateBooking,
    validateContact,
    validateLogin,
    validateRegister
};
