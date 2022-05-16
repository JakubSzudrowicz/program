const router = require('express').Router()
const User = require('../models/user.model')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')
const { registerValidator } = require('../utils/validators')

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
    })
)

router.get('/irolledmyfaceoverkeyboardtomakethissecretpath',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
async (req, res, next) => {
    res.render('registerUser')
})

router.post('/registerUser',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}), 
registerValidator,
 async (req, res, next) => {
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

module.exports = router