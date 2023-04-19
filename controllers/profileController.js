const dashboardConfig = require('../helpers/dashboardConfig')
const JWTService = require('../services/JWTService')
const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')
const friendsSchema = require('../schemas/friendsSchema')

const getProfile = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const config = await dashboardConfig(jwtCookie, './profile.ejs', 'Profile')
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const userData = await userModel.findById(userId)
  const posts = await postModel.find({ userId: userId })
  if (!userData) {
    res.clearCookie('jwt')
    return res.redirect('/auth/login')
  }
  const finalData = {
    username: userData.username,
    description: userData.description ? userData.description : '',
    noFriends: userData.noFriends,
    noFollowing: userData.noFollowing,
  }
  return res.render('./Pages/dashboard', {
    ...config,
    userData: finalData,
    userPosts: posts,
  })
}

const getOtherUserProfile = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = req.params.otherUserId
  const thisUserId = JWTService.GetDecodedToken(jwtCookie).userId
  if (thisUserId === userId) {
    // if the user clicks his own post, he should redirect to his/her profile page
    return res.redirect('/profile')
  }
  const userData = await userModel.findById(userId)
  console.log(userData)
  if (!userData) {
    return res.render('./Pages/notFoundError')
  }
  const userPosts = await postModel.find({ userId: userId })
  const isUserAlreadyFollowing = await friendsSchema.findOne({
    userId: thisUserId,
    followingUserId: userId,
  })
  const finalData = {
    userId: userData._id.toString(),
    username: userData.username,
    description: userData.description ? userData.description : '',
    noFriends: userData.noFriends,
    noFollowing: userData.noFollowing,
    alreadyFollowing: isUserAlreadyFollowing ? true : false,
  }
  const config = await dashboardConfig(
    jwtCookie,
    './otherUserProfile.ejs',
    userData.username,
  )
  return res.render('./Pages/dashboard', {
    ...config,
    otherUserData: finalData,
    otherUserPostsData: userPosts,
  })
}

const getEditProfile = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const config = await dashboardConfig(
    jwtCookie,
    './editProfile.ejs',
    'Edit Profile',
  )
  return res.render('./Pages/dashboard', { ...config })
}

const profileController = {
  getProfile,
  getEditProfile,
  getOtherUserProfile,
}

module.exports = profileController
