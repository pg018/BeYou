const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')
const JWTService = require('../services/JWTService')
const dashboardConfig = require('../helpers/dashboardConfig')

const getPosts = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const config = await dashboardConfig(jwtCookie, './posts.ejs', 'Feed')
  return res.render('./Pages/dashboard', config)
}

const postAddPost = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const postTitle = req.body.postTitle
  const postDescription = req.body.postDescription
  const finalObject = {
    userId,
    title: postTitle,
    description: postDescription,
  }
  await postModel(finalObject).save()
  await userModel.findByIdAndUpdate(userId, { lastPostedTime: new Date() })
  return res.redirect('/post/posts')
}

const postsController = {
  getPosts,
  postAddPost,
}

module.exports = postsController
