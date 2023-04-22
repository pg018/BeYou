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
  const posts = await postModel.find({ userId: userId }).lean().exec() //converting to json using lean()
  posts.forEach((post) => {
    //Checking if user has already, so that frontend like button can be colored
    const isAlreadyLiked = post.likedBy.filter((x) => x === userId).length !== 0
    post.isAlreadyLikedByThisUser = isAlreadyLiked
  })
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
  if (!userData) {
    return res.render('./Pages/notFoundError')
  }
  const userPosts = await postModel.find({ userId: userId }).lean().exec()
  userPosts.forEach((post) => {
    const isAlreadyLiked = //Checking if user has already, so that frontend like button can be colored
      post.likedBy.filter((x) => x === thisUserId).length !== 0
    post.isAlreadyLikedByThisUser = isAlreadyLiked
  })
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

const likePost = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  let returnPath = '/post/posts'
  const post = await postModel.findById(req.params.postId) // post he/she has liked/disliked
  if (req.params.currentPage === 'myProfile') {
    //Checks on which page is the post being liked
    returnPath = '/profile'
  } else if (req.params.currentPage === 'otherUser') {
    returnPath = `/profile/userProfile/${post.userId}`
  }
  const thisUserId = JWTService.GetDecodedToken(jwtCookie).userId //current userId
  if (!post) {
    return res.redirect(returnPath)
  }
  const hasUserAlreadyLiked = post.likedBy.filter((x) => x === thisUserId)
  if (hasUserAlreadyLiked.length === 0) {
    //not liked, so liking the post
    await postModel.updateOne(
      { _id: post._id.toString() },
      { $push: { likedBy: thisUserId }, $inc: { likes: 1 } },
      { new: true },
    )
    return res.redirect(returnPath)
  }
  await postModel.updateOne(
    { _id: post._id.toString() },
    { $pull: { likedBy: thisUserId }, $inc: { likes: -1 } },
    { new: true },
  )
  return res.redirect(returnPath)
}

const getEditProfile = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const config = await dashboardConfig(
    jwtCookie,
    './editProfile.ejs',
    'Edit Profile',
  )
  
  const userId = JWTService.GetDecodedToken(jwtCookie).userId;
  const user = await userModel.findById(userId).select("username profileImage -_id emailId dateOfBirth description gender");
  config.userData = user;
  console.log(config);
  return res.render('./Pages/dashboard', { ...config })
}

const postEditProfile = async (req, res) => {
  const jwtCookie = req.cookies.jwt;
  const userId = JWTService.GetDecodedToken(jwtCookie).userId;
  const updatedUser = await userModel.findOneAndUpdate({_id: userId}, {...req.body}, {new: true});

  return res.redirect("/profile/editProfile")
}

const profileController = {
  getProfile,
  getEditProfile,
  getOtherUserProfile,
  likePost,
  postEditProfile,
}

module.exports = profileController
