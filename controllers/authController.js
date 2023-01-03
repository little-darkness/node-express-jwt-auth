const jwt = require('jsonwebtoken')
const User = require("../models/User")

// handle error
const handleErrors = (errors) => {
    let customErrors = {email: '', password: ''}

    // duplicate error code
    if (errors.code === 11000) {
        customErrors.email = 'Email already exists'
    }

    // incorrect email
    if (errors.message === 'No such user found') {
        customErrors.email = 'No such user found'
    }

    // incorrect password
    if (errors.message === 'Incorrect password') {
        customErrors.password = 'Incorrect password'
    }

    // validation error
    if (errors.message.includes('user validation failed')) {
        Object.values(errors.errors).forEach(({properties}) => customErrors[properties.path] = properties.message)
    }
    return Object.fromEntries(Object.entries(customErrors).filter(([key, value]) => value !== ''))
}

const maxAge = 3 * 24 * 60 * 60

const createJwt = (userId) => {
    return jwt.sign({userId}, process.env.USER_SECRET, {
        expiresIn: maxAge
    })
}

// controller actions
module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.create({email, password})
        const token = createJwt(user._id)
        res.cookie('authToken', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json(
            {
                user: user._id,
            }
        )
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)
        const token = createJwt(user._id)
        res.cookie('authToken', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json(
            {
                user: user._id
            }
        )
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
}
