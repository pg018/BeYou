const mongoose = require('mongoose')
const replySchema = require("./replySchema").replySchema;

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  postId: {
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
  createdAt: {
    type: Date,
    default: new Date() 
  },
  commentId: {
    type: String
  }
})

commentSchema.pre('save', function (next) {
  this.commentId = this._id.toString()
  next()
})

const commentModel = mongoose.model('Comment', commentSchema, 'commentCollection')


module.exports.commentSchema = commentSchema;
module.exports.commentModel = commentModel;
