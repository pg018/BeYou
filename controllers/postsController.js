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
      alreadyFollowing: isAlreadyFollowing, //true or false
    }
  })
}

const sortPostsByDescendingDate = (postList) => {
  return postList.sort((a, b) => b.addedOn - a.addedOn)
}

const getPosts = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  
  const peopleMayKnowPromise = new Promise((resolve) =>
    resolve(userModel.find({ _id: { $ne: userId } })),
  ) //except current user all users

  const thisUserDataPromise = new Promise((resolve) =>
    resolve(userModel.findById(userId)),
  )
  
  const alreadyFriendsPromise = new Promise((resolve) =>
    resolve(friendsModel.find({ userId })),
  )

  //getting users for "People You May Know"
  const [thisUserData, usersList, alreadyFriends] = await Promise.all([
    thisUserDataPromise,
    peopleMayKnowPromise,
    alreadyFriendsPromise,
  ]) 
  //Checking whether user is admin or not
  const userIsAdmin = thisUserData.admin;
  
  //parallelizing the api calls to fetch all data at once using 3 different calls
  const finalSuggestedFriendsList = followingList(usersList, alreadyFriends)
  
  const mainFeedPosts = []
  // getting the following people's posts
  for (const user of finalSuggestedFriendsList) {
    if (user.alreadyFollowing) {
      const thisUserPosts = await postModel
        .find({ userId: user.stringId })
        .lean()
        .exec() //Converting mongo documents to json objects using lean() and exec() is used to execute it
      if (thisUserPosts.length > 0) {
        thisUserPosts.forEach((post) => {
          const isAlreadyLiked = //Checking if user has already, so that frontend like button can be colored
            post.likedBy.filter((x) => x === userId).length !== 0
          post.username = user.username
          post.isAlreadyLikedByThisUser = isAlreadyLiked
        })
      }
      mainFeedPosts.push(...thisUserPosts)
    }
  }
  const thisUserPosts = await postModel.find({ userId: userId }).lean().exec()
  thisUserPosts.forEach((post) => {
    const isAlreadyLiked = post.likedBy.filter((x) => x === userId).length !== 0
    post.username = thisUserData.username
    post.isAlreadyLikedByThisUser = isAlreadyLiked
  })
  mainFeedPosts.push(...thisUserPosts)
  //final config
  const config = await dashboardConfig(jwtCookie, './posts.ejs', 'Feed')
  return res.render('./Pages/dashboard', {
    ...config,
    suggestedFriends: finalSuggestedFriendsList,
    mainFeedPosts: sortPostsByDescendingDate(mainFeedPosts),
    admin: userIsAdmin,
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
