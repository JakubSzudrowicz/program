const router = require('express').Router()
const User = require('../models/user.model')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')

router.get('/login',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
 async (req, res, next) => {
    res.render('login')
})

router.post('/login',
    connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
    passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}))

router.get('/register',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
async (req, res, next) => {
    res.render('registerUser')
})

router.post('/registerUser',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}), [
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
], async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('registerUser', {
                email: req.body.email,
                messages: req.flash()})
            return
        }
        const {email} = req.body
        const doesExist = await User.findOne({email})
        if (doesExist) {
            req.flash('warning', `${email} already in use`)
            res.redirect('/auth/registerUser')
            return
        }
        const user = new User(req.body)
        await user.save()
        req.flash('success', `${user.email} registered succesfully`)
        res.redirect('/auth/login')
    } catch (error) {
        next(error)
    }
})

router.get('/logout',
connectEnsureLogin.ensureLoggedIn({redirectTo: '/'}),
 async (req, res, next) => {
    req.logout()
    res.redirect('/')
})

function ensureAdmin(req, res, next) {
    if(req.user.role === roles.admin) {
      next()
    } else {
      req.flash('warning', 'Permission denied')
      res.redirect('back')
    }
  }
  
module.exports = router