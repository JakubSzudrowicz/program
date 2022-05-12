const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

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
})

UserSchema.pre('save', async function(next) {
    try {
        if(this.isNew){
            const hashedPassword = await bcrypt.hash(this.password, 10)
            this.password = hashedPassword
        }
        next()
    }catch(error){
        next(error)
    }
})
const User = mongoose.model('user', UserSchema)
module.exports = User;