const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')
const JWTService = require('../services/JWTService')
const friendsModel = require('../schemas/friendsSchema')
const dashboardConfig = require('../helpers/dashboardConfig')

//This function creates a new property for alreadyFollowing users by mapping usersCollection with FriendsCollection
const followingList = (userList, followingList) => {
  return userList.map((user) => {
    const isAlreadyFollowing = followingList.some(
      (following) => following.followingUserId === user._id.toString(),
    )
    return {
      ...user.toJSON(),
      alreadyFollowing: isAlreadyFollowing,
      stringId: user._id.toString(),
    }
  })
}

const getPosts = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId

  //getting users for "People You May Know"
  const usersList = await userModel.find({ _id: { $ne: userId } }) //except current user all users
  const alreadyFriends = await friendsModel.find({ userId })
  const finalSuggestedFriendsList = followingList(usersList, alreadyFriends)
  //final config
  const config = await dashboardConfig(jwtCookie, './posts.ejs', 'Feed')
  return res.render('./Pages/dashboard', {
    ...config,
    suggestedFriends: finalSuggestedFriendsList,
  })
}

const putAddFriend = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const friendUserId = req.params.friendId
  const isAlreadyFriend = await friendsModel.find({
    userId: userId,
    followingUserId: friendUserId,
  })
  if (isAlreadyFriend.length > 0) {
    // if already a friend, we will unfriend them
    await friendsModel.findOneAndDelete({
      userId,
      followingUserId: friendUserId,
    })
    await userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { noFollowing: -1 } },
      { new: true },
    )
    await userModel.findOneAndUpdate(
      { _id: friendUserId },
      { $inc: { noFriends: -1 } },
      { new: true },
    )
    return res.redirect('/post/posts')
  }
  //not friends, so adding them
  await friendsModel({
    userId,
    followingUserId: friendUserId,
  }).save()
  await userModel.findOneAndUpdate(
    { _id: userId },
    { $inc: { noFollowing: 1 } },
    { new: true },
  )
  await userModel.findOneAndUpdate(
    { _id: friendUserId },
    { $inc: { noFriends: 1 } },
    { new: true },
  )
  return res.redirect('/post/posts')
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
  putAddFriend,
}

module.exports = postsController
