const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true
  },
  commentId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: new Date() },
  replyId: {
    type: String
  }
})

replySchema.pre('save', function (next) {
  this.replyId = this._id.toString()
  next()
})

const replyModel = mongoose.model('Reply', replySchema, 'replyCollection')

module.exports.replySchema = replySchema;
module.exports.replyModel = replyModel;
