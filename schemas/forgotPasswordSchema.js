const mongoose = require('mongoose')

const forgotPasswordSchema = new mongoose.Schema({
  userId: { type: String },
  otpCode: { type: Number },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 1000), // Adding 2 minutes as expiry date
  },
}).required()

const forgotPasswordModel = mongoose.model(
  'ForgotPassword',
  forgotPasswordSchema,
  'ForgotPasswordCollection',
)

module.exports = forgotPasswordModel
