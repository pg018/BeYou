const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: new Date() },
})

replySchema.pre('save', function (next) {
  this.stringId = this._id.toString()
  next()
})


module.exports.replySchema = replySchema;
