const express = require('express')
const notificationsController = require('../controllers/notificationsController')

const router = express.Router()

router.get("/", notificationsController.getNotifications)

module.exports = router