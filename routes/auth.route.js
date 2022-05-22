const router = require('express').Router()
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')
const UserLog = require('../models/userLogs.model')

router.get('/login',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
 async (req, res, next) => {
    res.render('login')
})

router.post('/login',
    connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
    passport.authenticate('local', { 
    successReturnToOrRedirect: '/auth/userlogin',
    failureRedirect: '/auth/login',
    failureFlash: true
    }),
)

router.get('/userlogin',
connectEnsureLogin.ensureLoggedIn({redirectTo: '/'}),
 async (req, res, next) => {
    const person = req.user
    await UserLog.create({
        email: person.email,
        type: 'login',
    })
    res.redirect('/')
})

router.get('/logout',
connectEnsureLogin.ensureLoggedIn({redirectTo: '/'}),
 async (req, res, next) => {
    const person = req.user
    await UserLog.create({
        email: person.email,
        type: 'logout',
    })
    req.session.destroy()
    // req.logout()
    res.redirect('/')
})

module.exports = router