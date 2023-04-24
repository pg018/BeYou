const userModel = require('../schemas/userSchema')
const JWTService = require('../services/JWTService')
const notificationsModel = require('../schemas/notificationSchema')

const isTimeLessThan24hrs = (userDate) => {
  const currentDate = new Date()
  const timeDiff = currentDate.getTime() - userDate.getTime()
  const timeDiffInHrs = 24 - (timeDiff / (1000 * 3600)).toFixed(0)
  return [timeDiffInHrs, timeDiff <= 24 * 60 * 60 * 1000]
}

const dashboardConfig = async (jwtCookie, main, title) => {
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const userInfo = await userModel.findById(userId)
  const notificationsNumber = (await notificationsModel.find({toId: userId})).length
  if (userInfo.lastPostedTime) {
    const [timeDiff, isTimeLess24hrs] = isTimeLessThan24hrs(
      userInfo.lastPostedTime,
    )
    if (isTimeLess24hrs) {
      return {
        main,
        title,
        notificationsNumber,
        showPostButton: false,
        postButtonTimeRemaining: timeDiff.toString(),
        userData: {
          profileImage: userInfo.profileImage,
          admin: userInfo?.admin,
        },
        suggestedFriends: [],
        userPosts: [],
        mainFeedPosts: [],
        otherUserData: {},
        otherUserPostsData: [],
        editProfileError: '',
        notifications: [],
        openedPost: {},
        filteredUsersList: [],
        userSettingsError: '',
      }
    }
  }
  return {
    main,
    title,
    showPostButton: true,
    notificationsNumber,
    postButtonTimeRemaining: '',
    suggestedFriends: [],
    userData: { profileImage: userInfo.profileImage, admin: userInfo?.admin },
    userPosts: [],
    mainFeedPosts: [],
    otherUserData: {},
    otherUserPostsData: [],
    editProfileError: '',
    notifications: [],
    openedPost: {},
    filteredUsersList: [],
    userSettingsError: '',
  }
}

module.exports = dashboardConfig
