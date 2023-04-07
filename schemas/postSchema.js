const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '', required: true },
  addedOn: { type: Date, default: Date.now(), required: true },
  likes: { type: Number, default: 0, required: true },
})

const postModel = mongoose.model('Post', postSchema, 'postCollection')

module.exports = postModel
