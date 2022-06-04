const { body } = require('express-validator')

module.exports = {
    registerValidator: [
        body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail()
        .toLowerCase(),
        body('password')
        .trim()
        .isLength(2)
        .withMessage('Password require at least 2 characters'),
        body('password2')
        .custom((value, {req} ) => {
            if(value !== req.body.password) {
                throw new Error('Passwords dont match')
            }
            return true
        })
    ],
    deviceValidator: [
        body('deviceName')
        .trim()
        .isLength(2)
        .withMessage('Device name too short'),
        body('deviceType')
        .trim()
        .isLength(2)
        .withMessage('Device type too short'),
    ],

    simulatorValidator: [
        body('deviceIPsimulator')
        .trim()
        .isIP()
        .withMessage('Not valid IP'),
        body('deviceIDsimulator')
        .trim()
        .isInt()
        .withMessage('Enter number'),
        body('devicePORTsimulator')
        .trim()
        .isPort()
        .withMessage('Not a port'),
        body('addressSimulator')
        .trim()
        .isInt()
        .withMessage('Enter number'),
        body('quantitySimulator')
        .trim()
        .isInt()
        .withMessage('Enter number'),
    ]

}
