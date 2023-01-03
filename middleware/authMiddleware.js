const jwt = require('jsonwebtoken')

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

module.exports = requireAuth
