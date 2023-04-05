const mongoose = require('mongoose')

const friendsSchema = new mongoose.Schema({
  userId: { type: String },
  followingUserId: { type: String },
}).required()

const friendsModel = mongoose.model(
  'Friends',
  friendsSchema,
  'FriendsCollection',
)

module.exports = friendsModel
