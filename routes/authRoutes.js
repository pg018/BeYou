const authControllers = require('../controllers/authController')
const express = require('express')
const authRouter = express.Router()

authRouter.post('/login', authControllers.postLogin)
authRouter.get('/login', authControllers.getLogin)
authRouter.get('/signup', authControllers.getRegister)
authRouter.post('/signup', authControllers.postRegister)

module.exports = authRouter
