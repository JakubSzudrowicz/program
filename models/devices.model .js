const mongoose = require('mongoose')
const createHttpError = require('http-errors')

const DeviceSchema = new mongoose.Schema({
    deviceName:{
        type: String,
        required: true,
        unique:true,
    },
    deviceType: {
        type: String,
        required: true,
    },

})

const Device = mongoose.model('devices', DeviceSchema)
module.exports = Device;