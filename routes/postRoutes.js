const express = require('express')
const postsController = require('../controllers/postsController')
const router = express.Router()

router.get('/posts', postsController.getPosts)
router.post('/addPost', postsController.postAddPost)
router.get('/addFriend/:friendId', postsController.putAddFriend)
router.get('/posts/:postId', postsController.getPost)
router.get('/posts/:postId/:commentId', postsController.getPostWithReply)
router.post('/addComment', postsController.addComment)
router.post('/addReply', postsController.addReply);

module.exports = router
