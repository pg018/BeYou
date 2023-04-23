const mongoose = require('mongoose')
const replySchema = require("./replySchema");

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  replies: {
    type: [replySchema],
    default: []
  },
  createdAt: { type: Date, default: new Date() },
  stringId: {
    type: String
  }
})

commentSchema.pre('save', function (next) {
  this.stringId = this._id.toString()
  next()
})

module.exports = commentSchema;
