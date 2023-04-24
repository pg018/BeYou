const dashboardConfig = require('../helpers/dashboardConfig')
const notificationModel = require('../schemas/notificationSchema')
const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')
const JWTService = require('../services/JWTService')

const getNotifications = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const config = await dashboardConfig(
    jwtCookie,
    './notification.ejs',
    'Notifications',
  )
  const notifications = await notificationModel
    .find({ toId: userId })
    .lean()
    .exec()
  let finalNotifications = []
  for (const notification of notifications) {
    if (notification.imageRequiredNotification) {
      const fromUserData = await userModel
        .findById(notification.fromId)
        .lean()
        .exec() //converts to json
      const newNotification = { ...notification }
      newNotification.fromUserProfileImage = fromUserData?.profileImage
      newNotification.fromUserUsername = fromUserData.username
      newNotification.message = `${notification.message}`
      if (notification.likedPostId) {
        const image = await postModel
          .findById(notification.likedPostId)
          .select('uploadedImages')
          .lean()
          .exec()
        newNotification.likedImage = image.uploadedImages
      }
      finalNotifications.push(newNotification)
    } else {
      finalNotifications.push(notification)
    }
  }
  
  finalNotifications = finalNotifications.reverse() //descending order
  return res.render('./Pages/dashboard', {
    ...config,
    notifications: finalNotifications,
  })
}

const notificationsController = {
  getNotifications,
}

module.exports = notificationsController
