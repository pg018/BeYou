const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')
const JWTService = require('../services/JWTService')

const isTimeLessThan24hrs = (userDate) => {
  const currentDate = new Date()
  const timeDiff = currentDate.getTime() - userDate.getTime()
  const timeDiffInHrs = 24 - (timeDiff/(1000*3600)).toFixed(0)
  return [timeDiffInHrs, timeDiff <= 24 * 60 * 60 * 1000]
}

const getPosts = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const userInfo = await userModel.findById(userId)
  if (userInfo.lastPostedTime) {
    const [timeDiff, isTimeLess24hrs] = isTimeLessThan24hrs(
      userInfo.lastPostedTime,
    )
    if (isTimeLess24hrs) {
      return res.render('./Pages/dashboard', {
        main: './posts.ejs',
        title: 'Feed',
        showPostButton: false,
        postButtonTimeRemaining: timeDiff.toString(),
      })
    }
  }
  return res.render('./Pages/dashboard', {
    main: './posts.ejs',
    title: 'Feed',
    showPostButton: true,
    postButtonTimeRemaining: '',
  })
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
