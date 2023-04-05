const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
  userId: { type: String },
  token: { type: String },
}).required()

const loginModel = mongoose.model('Login', loginSchema, 'LoginCollection')

module.exports =  loginModel
