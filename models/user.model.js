const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const createHttpError = require('http-errors')
const {roles} =require('../utils/constants')

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [roles.admin, roles.user],
        default: roles.user,
        required: true,
    },
})

UserSchema.pre('save', async function(next) {
    try {
        if(this.isNew){
            const hashedPassword = await bcrypt.hash(this.password, 10)
            this.password = hashedPassword
            if(this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
                this.role = roles.admin
            }
        }
        next()
    }catch(error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)

    } catch (error) {
        throw createHttpError.InternalServerError(error.message)        }
}

const User = mongoose.model('user', UserSchema)
module.exports = User;