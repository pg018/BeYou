const express = require('express')
const postsController = require('../controllers/postsController')
const router = express.Router()

router.get('/posts', postsController.getPosts)
router.post('/addPost', postsController.postAddPost)
router.get('/addFriend/:friendId', postsController.putAddFriend)

module.exports = router
