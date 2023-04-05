const express = require('express')
const postsController = require('../controllers/postsController')
const router = express.Router()

router.get('/posts',postsController.getPosts)

module.exports = router