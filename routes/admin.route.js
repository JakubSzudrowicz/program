const router = require('express').Router()
const User = require('../models/user.model')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const connectEnsureLogin = require('connect-ensure-login')
const mongoose = require('mongoose')
const { roles } = require('../utils/constants')
const { registerValidator } = require('../utils/validators')

router.get('/terminal', async (req, res , next) => {
 res.render('terminal')
})

router.get('/users', async (req, res , next) => {
    try {
        const users = await User.find()
        res.render('manage-users', { users })
    } catch (error) {
        next(error)
    }
})

router.get('/user/:id', async (req, res, next) => {
    try { 
        const { id } = req.params
        if(!mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error', 'Invalid id')
            res.redirect('/admin/users')
            return 
        }
        const person = await User.findById(id)
        res.render('profile', {person})
    } catch (error) {
    next(error) 
    }
})

router.post('/update-role', async (req, res, next) => {
    try {
      const { id, role } = req.body
      if ( !id || !role) {
        req.flash('error', 'Invalid request')
        return res.redirect('back')
      }
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id')
        return res.redirect('back')
      }
  
      const rolesArray = Object.values(roles);
      if (!rolesArray.includes(role)) {
        req.flash('error', 'Invalid role')
        return res.redirect('back')
      }
  
      if (req.user.id === id) {
        req.flash('error','Admin cannot remove themselves.');
        return res.redirect('back')
      }
  
      const user = await User.findByIdAndUpdate(id,{ role },{ new: true, runValidators: true })
  
      req.flash('info', `Role for ${user.email} updated`)
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  })

  router.post('/delete', async (req, res, next) => {
    try {
      const { id} = req.body
      if (!id) {
        req.flash('error', 'Invalid request')
        return res.redirect('back')
      }
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id')
        return res.redirect('back')
      }
  
      if (req.user.id === id) {
        req.flash('error','Admin cannot remove themselves.');
        return res.redirect('back')
      }
  
      const user = await User.findByIdAndRemove(id, { runValidators: true })
  
      req.flash('info', `${user.email} removed`)
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  })

router.get('/register',
connectEnsureLogin.ensureLoggedIn({redirectTo: '/'}),
async (req, res, next) => {
    res.render('register')
})

router.post('/register',
connectEnsureLogin.ensureLoggedIn({redirectTo: '/'}),
 registerValidator,
  async (req, res, next) => {
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
            res.redirect('/admin/register')
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

router.get('/logout',
connectEnsureLogin.ensureLoggedIn({redirectTo: '/'}),
 async (req, res, next) => {
    req.logout()
    res.redirect('/')
})

module.exports = router