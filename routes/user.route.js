const router = require('express').Router()

router.get('/profile', async (req, res, next) => {
    const person = req.user
    res.render('profile',{person})
})

router.get('/signals', async (req, res, next) => {
    const person = req.user
    res.render('userSignals')
})

router.get('/devices', async (req, res, next) => {
    const person = req.user
    res.render('userDevices')
})

module.exports = router