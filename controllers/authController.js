const User = require("../models/User")

// handle error
const handleErrors = (errors) => {
  console.log(errors.message, errors.code)
  let customErrors = {email: '', password: ''}

  // duplicate error code
  if (errors.code === 11000) {
    customErrors.email = 'Email already exists'
    return Object.fromEntries(Object.entries(customErrors).filter(([key, value]) => value !== ''))
  }

  // validation error
  if (errors.message.includes('user validation failed')) {
    Object.values(errors.errors).forEach(({properties}) => customErrors[properties.path] = properties.message)
  }
  return Object.fromEntries(Object.entries(customErrors).filter(([key, value]) => value !== ''))
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
    res.status(201).json(user)
  } catch (error) {
    const errors = handleErrors(error)
    res.status(400).json({errors})
  }
}

module.exports.login_post = async (req, res) => {
  res.send(req.body)
}
