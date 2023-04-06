const mongoose = require('mongoose')

const forgotPasswordSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date() },
  emailId: { type: String, required: true },
  otpCode: { type: Number, required: true },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 1000), // Adding 2 minutes as expiry date
    required: true,
  },
})

const forgotPasswordModel = mongoose.model(
  'ForgotPassword',
  forgotPasswordSchema,
  'ForgotPasswordCollection',
)

forgotPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 })

module.exports = forgotPasswordModel
