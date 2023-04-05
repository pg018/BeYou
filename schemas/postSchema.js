const mongoose = require('mongoose')
import { emptyString } from '../helpers/constants'

const postSchema = new mongoose.Schema({
  userId: { type: String },
  title: { type: String },
  description: { type: String, default: emptyString },
  addedOn: { type: Date, default: Date.now() },
  likes: { type: Number, default: 0 },
}).required() //This removes the need to add required to each property individually

const postModel = mongoose.model('Post', postSchema, 'postCollection')

module.exports =  postModel
