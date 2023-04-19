const express = require('express')
const profileController = require('../controllers/profileController')

const router = express.Router()

router.get('/', profileController.getProfile)
router.get('/editProfile', profileController.getEditProfile)
router.get('/userProfile/:otherUserId', profileController.getOtherUserProfile)

module.exports = router
