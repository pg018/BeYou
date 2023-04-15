const dashboardConfig = require('../helpers/dashboardConfig')
const JWTService = require('../services/JWTService')
const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')

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
}

module.exports = profileController
