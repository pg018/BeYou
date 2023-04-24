const mongoose = require('mongoose')
const commentSchema = require("./CommentSchema").commentSchema;

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '', required: true },
  addedOn: { type: Date, default: Date.now(), required: true },
  likes: { type: Number, default: 0, required: true },
  likedBy: { type: [String], default: [], required: true },
  stringId: { type: String },
  uploadedImages: { type: String, default: ""},
  comments: {type: [commentSchema], default: []}
})

postSchema.pre('save', function (next) {
  this.stringId = this._id.toString() 
  next()
})

const postModel = mongoose.model('Post', postSchema, 'postCollection')

module.exports = postModel
