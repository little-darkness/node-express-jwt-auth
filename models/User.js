const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email should not be empty'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password should not be empty'],
        minlength: [8, 'Password should be minimum 8 characters'],
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User
