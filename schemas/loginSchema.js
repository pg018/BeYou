const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
})

const loginModel = mongoose.model('Login', loginSchema, 'LoginCollection')

module.exports = loginModel
