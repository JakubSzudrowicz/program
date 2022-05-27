const router = require('express').Router()
const passport = require('passport')
const mongoose = require('mongoose')
const { deviceValidator } = require('../utils/validators')
const Device = require('../models/devices.model ')
const { body, validationResult } = require('express-validator')


router.get('/', async (req, res, next) => {
  try {
      const devices = await Device.find()
      // res.json({ devices })
    res.render('adminDevices', {devices})
  } catch (error) {
      next(error)
  }
}) 

// router.post('/:id', async (req, res, next) => {
//     try { 
//         const { id } = req.params
//         if(!mongoose.Types.ObjectId.isValid(id)) {
//             req.flash('error', 'Invalid id')
//             res.redirect('/admin/devices')
//             return 
//         }
//         const device = await Device.findById(id)
//         // res.render('profile', {device})
//         res.json({device})
//     } catch (error) {
//     next(error) 
//     }
// })

// router.post('/update-role', async (req, res, next) => {
//     try {
//       const { id, role } = req.body
//       if ( !id || !role) {
//         req.flash('error', 'Invalid request')
//         return res.redirect('/admin/users')
//       }
  
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         req.flash('error', 'Invalid id')
//         return res.redirect('/admin/users')
//       }
  
//       const rolesArray = Object.values(roles);
//       if (!rolesArray.includes(role)) {
//         req.flash('error', 'Invalid role')
//         return res.redirect('/admin/users')
//       }
  
//       if (req.user.id === id) {
//         req.flash('error','Admin cannot remove themselves.');
//         return res.redirect('/admin/users')
//       }

//       const user = await User.findById(id)

//       if (user.email === process.env.ADMIN_EMAIL) {
//         req.flash('error','Cannot change role of super admin.');
//         return res.redirect('/admin/users')
//       }

//       await User.findByIdAndUpdate(id,{ role },{ new: true, runValidators: true })
  
//       req.flash('info', `Role for ${user.email} updated`)
//       res.redirect('/admin/users')
//     } catch (error) {
//       next(error)
//     }
//   })

  router.post('/delete', async (req, res, next) => {
    try {
      const {id} = req.body

      if (!id) {
        req.flash('error', 'Invalid request')
        return res.redirect('back')
      }
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id')
        return res.redirect('back')
      }
      
      const device = await Device.findById(id)
      await device.remove()
  
      req.flash('info', `${device.deviceName} removed`)
      res.redirect('/admin/devices')
    } catch (error) {
      next(error)
    }
  })

router.get('/addDevice',
async (req, res, next) => {
    res.render('addDevice')
})

router.post('/addDevice',
 deviceValidator,
  async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('addDevice', {
                deviceName: req.body.deviceName,
                messages: req.flash()})
            return
        }

        const {deviceName} = req.body
        const doesExist = await Device.findOne({deviceName})
        if (doesExist) {
            req.flash('warning', `${deviceName} exists`)
            res.redirect('/admin/devices/')
            return
        }

        const device = new Device(req.body)
        await device.save()
        req.flash('success', `${device.deviceName} added succesfully`)
        res.redirect('/admin/devices/')
    } catch (error) {
        next(error)
    }
})

module.exports = router