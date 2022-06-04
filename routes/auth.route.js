const router = require('express').Router()
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')
const UserLog = require('../models/userLogs.model')
const rateLimit = require('express-rate-limit')
const MongoStore = require('rate-limit-mongo')

const loginRateLimit = rateLimit({
  windowsMs: 2 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler:  function (req, res) {
      req.flash('error', 'You are blocked')
      res.redirect('back')
  },
  store: new MongoStore({
    uri: process.env.RATELIMIT_URI,
    expireTimeMs: 2 * 60 * 1000,
  }),
})

router.get('/login',
connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
 async (req, res, next) => {
    res.render('login')
})


router.post('/login',
    loginRateLimit,
    connectEnsureLogin.ensureLoggedOut({redirectTo: '/'}),
    passport.authenticate('local', { 
    successReturnToOrRedirect: '/auth/userlogin',
    failureRedirect: '/auth/login',
    failureFlash: true
    }),
)

//do zmiany na middleware??
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