const jwt = require('jsonwebtoken')
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.authToken

    if (token) {
        jwt.verify(token, process.env.USER_SECRET, {}, (error) => {
            if (error) {
                res.redirect('/login')
            } else {
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.authToken

    if (token) {
        jwt.verify(token, process.env.USER_SECRET, {}, async (error, decodedToken) => {
            if (error) {
                res.locals.user = null
                next()
            } else {
                res.locals.user = await User.findById(decodedToken.userId)
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = {requireAuth, checkUser}
