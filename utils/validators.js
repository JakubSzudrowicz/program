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
    ]
}