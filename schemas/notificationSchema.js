const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: new Date() },
  fromId: { type: String, required: true },
  toId: { type: String, required: true },
  message: { type: String, required: true },
  imageRequiredNotification: { type: Boolean, default: false, required: true },
  likedPostId: { type: String, default: null, required: false },
})

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }) //7days

const notificationModel = mongoose.model(
  'Notification',
  notificationSchema,
  'NotificationCollection',
)

module.exports = notificationModel
