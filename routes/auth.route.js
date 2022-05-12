const router = require('express').Router()
const User = require('../models/user.model')
const { body, validationResult } = require('express-validator')

router.get('/login', async (req, res, next) => {
    res.render('login')
})

router.post('/login', async (req, res, next) => {
    res.send('Login post')
})

router.get('/register', async (req, res, next) => {

    
    res.render('register')
})

router.post('/register', [
    body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .toLowerCase(),
    body('password')
    .trim()
    .isLength(2)
    .withMessage('Password must require at least 2 characters'),
    body('password2')
    .custom((value, {req} ) => {
        if(value !== req.body.password) {
            throw new Error('Passwords dont match')
        }
        return true
    })
], async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('register', {
                email: req.body.email,
                messages: req.flash()})
            return
        }
        const {email} = req.body
        const doesExist = await User.findOne({email})
        if (doesExist) {
            req.flash('warning', `${email} already in use`)
            res.redirect('/auth/register')
            return
        }
        const user = new User(req.body)
        await user.save()
        req.flash('success', `${user.email} registered succesfully`)
        res.redirect('/')
    } catch (error) {
        next(error)
    }
})

router.get('/logout', async (req, res, next) => {
    res.send('Logout')
})

module.exports = router