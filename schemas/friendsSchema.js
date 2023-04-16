const mongoose = require('mongoose')

const friendsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  followingUserId: { type: String, required: true },
})

const friendsModel = mongoose.model(
  'Friends',
  friendsSchema,
  'FriendsCollection',
)

module.exports = friendsModel
