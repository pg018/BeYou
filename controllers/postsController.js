const userModel = require('../schemas/userSchema')
const postModel = require('../schemas/postSchema')
const JWTService = require('../services/JWTService')
const friendsModel = require('../schemas/friendsSchema')
const notificationModel = require('../schemas/notificationSchema')
const commentModel = require('../schemas/CommentSchema').commentModel
const replyModel = require('../schemas/replySchema').replyModel
const dashboardConfig = require('../helpers/dashboardConfig')
const timeSince = require('../helpers/dateTimeHelper')
const moment = require('moment')

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
          post.profileImage = user.profileImage
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
    post.profileImage = thisUserData.profileImage
  })
  mainFeedPosts.push(...thisUserPosts)
  //final config
  const config = await dashboardConfig(jwtCookie, './posts.ejs', 'Feed')
  return res.render('./Pages/dashboard', {
    ...config,
    suggestedFriends: finalSuggestedFriendsList,
    mainFeedPosts: sortPostsByDescendingDate(mainFeedPosts),
    userData: thisUserData,
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
  const notificationDocument = {
    fromId: userId,
    toId: friendUserId,
    message: 'started following you',
    imageRequiredNotification: true,
  }
  await notificationModel(notificationDocument).save()
  return res.redirect('/post/posts')
}

const postAddPost = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const postTitle = req.body.postTitle
  const postDescription = req.body.postDescription
  const uploadedImages = req.body.uploadedImages.trim()
  const finalObject = {
    userId,
    title: postTitle,
    description: postDescription,
    uploadedImages: uploadedImages,
  }
  await postModel(finalObject).save()
  await userModel.findByIdAndUpdate(userId, { lastPostedTime: new Date() })
  return res.redirect('/post/posts')
}

const getPost = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const config = await dashboardConfig(jwtCookie, './postMain.ejs', 'Post')

  const post = await postModel
    .findOne({ stringId: req.params.postId })
    .lean()
    .exec()

  const user = await userModel.findOne({ stringId: post.userId }).lean().exec()

  const isAlreadyLiked = post.likedBy.filter((x) => x === userId).length !== 0 //Checking if user has already, so that frontend like button can be colored

  config.openedPost = {
    ...post,
    isAlreadyLikedByThisUser: isAlreadyLiked,
    username: user.username,
    addedOn: post.addedOn,
    profileImage: user.profileImage,
  }

  config.openedPost.comments = []
  if (post.comments) {
    for (const commentId of post.comments) {
      const comment = await commentModel.findOne({ commentId }).lean().exec()
      console.log(comment)
      const userOfComment = await userModel
        .findOne({ stringId: comment.userId })
        .select('username profileImage -_id stringId')
        .lean()
        .exec()
      comment.username = userOfComment.username
      comment.profileImage = userOfComment.profileImage
      comment.commentUserId = userOfComment.stringId
      comment.timeSince = moment(
        comment.createdAt,
        'ddd MMM DD YYYY HH:mm:ss GMT Z',
      ).fromNow()
      config.openedPost.comments.push(comment)
    }
  }

  config.openedPost.comments = config.openedPost.comments.reverse()

  res.render('./Pages/dashboard', { ...config })
}

const addComment = async (req, res) => {
  console.log(req.body)
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId

  const post = await postModel.findOne({ stringId: req.body.stringId })
  console.log(post)

  const comment = await new commentModel({
    userId: userId,
    postId: req.body.stringId,
    comment: req.body.comment,
  })

  await comment.save()
  await post.updateOne({ $push: { comments: comment.commentId } })

  return res.redirect(`/post/posts/${req.body.stringId}`)
}

const addReply = async (req, res) => {
  console.log(req.body)
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const comment = await commentModel.findOne({ commentId: req.body.commentId })
  console.log(comment)
  const reply = new replyModel({
    userId: userId,
    postId: req.body.postId,
    commentId: req.body.commentId,
    message: req.body.reply,
  })

  await reply.save()
  await comment.updateOne({ $push: { replies: reply.replyId } })

  return res.redirect(`/post/posts/${req.body.postId}/${req.body.commentId}`)
}

const getPostWithReply = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const config = await dashboardConfig(jwtCookie, './postMain.ejs', 'Post')

  const post = await postModel
    .findOne({ stringId: req.params.postId })
    .lean()
    .exec()

  const user = await userModel.findOne({ stringId: post.userId }).lean().exec()

  const isAlreadyLiked = post.likedBy.filter((x) => x === userId).length !== 0 //Checking if user has already, so that frontend like button can be colored

  config.openedPost = {
    ...post,
    isAlreadyLikedByThisUser: isAlreadyLiked,
    username: user.username,
    addedOn: post.addedOn,
    profileImage: user.profileImage,
  }

  config.openedPost.comments = []
  if (post.comments) {
    for (const commentId of post.comments) {
      const comment = await commentModel.findOne({ commentId }).lean().exec()
      console.log(comment)
      const userOfComment = await userModel
        .findOne({ stringId: comment.userId })
        .select('username profileImage -_id stringId')
        .lean()
        .exec()

      if (commentId === req.params.commentId) {
        if (comment.replies) {
          let replies = []
          for (const replyId of comment.replies) {
            const reply = await replyModel
              .findOne({ replyId: replyId })
              .lean()
              .exec()

            const UserWhoReplied = await userModel
              .findOne({ stringId: reply.userId })
              .lean()
              .exec()

            replies.push({
              ...reply,
              username: UserWhoReplied.username,
              profileImage: UserWhoReplied.profileImage,
              repliedUserId: UserWhoReplied.stringId,
            })
          }

          comment.replies = replies.reverse()
        }
      }

      comment.username = userOfComment.username
      comment.profileImage = userOfComment.profileImage
      comment.timeSince = moment(
        comment.createdAt,
        'ddd MMM DD YYYY HH:mm:ss GMT Z',
      ).fromNow()
      config.openedPost.comments.push({...comment, commentUserId: userOfComment.stringId})
    }
  }

  config.openedPost.comments = config.openedPost.comments.reverse()

  console.log(config.openedPost.comments[0])

  res.render('./Pages/dashboard', {
    ...config,
    showCommentIdForSinglePost: req.params.commentId,
  })
}

const postsController = {
  getPosts,
  postAddPost,
  putAddFriend,
  getPost,
  addComment,
  addReply,
  getPostWithReply,
}

module.exports = postsController
