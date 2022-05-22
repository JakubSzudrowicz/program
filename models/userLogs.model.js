const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const createHttpError = require('http-errors')

const UserLogsSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
    },
    type: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})


const UserLogs = mongoose.model('userlogs', UserLogsSchema)
module.exports = UserLogs;

