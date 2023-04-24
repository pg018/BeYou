const express = require('express')
const profileController = require('../controllers/profileController')

const router = express.Router()

router.get('/', profileController.getProfile)
router.get('/editProfile', profileController.getEditProfile)
router.get('/userProfile/:otherUserId', profileController.getOtherUserProfile)
router.get('/likePost/:postId/:currentPage', profileController.likePost)
router.post('/editProfile', profileController.postEditProfile)
router.get('/search', profileController.searchProfile)
router.get('/userSettings', profileController.getUserSettings)
router.post('/updatePassword', profileController.updatePassword)
router.get('/followers/:givenUserId', profileController.getFollowersList)
router.get('/following/:givenUserId', profileController.getFollowingList)
router.get('/deleteAccount', profileController.deleteAccount)

module.exports = router
