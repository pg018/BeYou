const mongoose = require('mongoose')

//This is the main schema of the userCollections
const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastPostedTime: { type: Date, required: false },
  description: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  noFriends: { type: Number, default: 0, required: true },
  noFollowing: { type: Number, default: 0, required: true },
  stringId: {type: String},
})

userSchema.pre('save', function(next) {
  this.stringId = this._id.toString()
  next()
})

//This creates a model that is used throughout the code. (ModelName, schema, collection name in database)
const userModel = mongoose.model('User', userSchema, 'UserCollection')

module.exports = userModel
