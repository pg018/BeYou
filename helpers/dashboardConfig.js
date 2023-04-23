const userModel = require('../schemas/userSchema')
const JWTService = require('../services/JWTService')

const isTimeLessThan24hrs = (userDate) => {
  const currentDate = new Date()
  const timeDiff = currentDate.getTime() - userDate.getTime()
  const timeDiffInHrs = 24 - (timeDiff / (1000 * 3600)).toFixed(0)
  return [timeDiffInHrs, timeDiff <= 24 * 60 * 60 * 1000]
}

const dashboardConfig = async (jwtCookie, main, title) => {
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const userInfo = await userModel.findById(userId)
  if (userInfo.lastPostedTime) {
    const [timeDiff, isTimeLess24hrs] = isTimeLessThan24hrs(
      userInfo.lastPostedTime,
    )
    if (isTimeLess24hrs) {
      return {
        main,
        title,
        showPostButton: false,
        postButtonTimeRemaining: timeDiff.toString(),
        userData: {},
        suggestedFriends: [],
        userPosts: [],
        mainFeedPosts: [],
        otherUserData: {},
        otherUserPostsData: [],
        editProfileError: '',
      }
    }
  }
  return {
    main,
    title,
    showPostButton: true,
    postButtonTimeRemaining: '',
    suggestedFriends: [],
    userData: {},
    userPosts: [],
    mainFeedPosts: [],
    otherUserData: {},
    otherUserPostsData: [],
    editProfileError: '',
  }
}

module.exports = dashboardConfig
