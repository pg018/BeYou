const authControllers = require('../controllers/authController')
const express = require('express')
const authRouter = express.Router()

authRouter.post('/login', authControllers.postLogin)

module.exports = authRouter
