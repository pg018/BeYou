const express = require('express')
const authRouter = express.Router()
const authControllers = require('../controllers/authController')
const forgotPasswordController = require('../controllers/forgotPasswordController')
const authMiddleware = require('../middlewares/authorizationMiddleware')

//had to use authMiddleware here because of signout route.
authRouter.post(
  '/login',
  authMiddleware.isAlreadyLoggedIn,
  authControllers.postLogin,
)
authRouter.get(
  '/login',
  authMiddleware.isAlreadyLoggedIn,
  authControllers.getLogin,
)
authRouter.get(
  '/signup',
  authMiddleware.isAlreadyLoggedIn,
  authControllers.getRegister,
)
authRouter.post(
  '/signup',
  authMiddleware.isAlreadyLoggedIn,
  authControllers.postRegister,
)
authRouter.get('/signout', authControllers.getSignOut)
authRouter.get(
  '/forgotPassword',
  authMiddleware.isAlreadyLoggedIn,
  forgotPasswordController.getForgotPassword,
)
authRouter.post(
  '/forgotPassword',
  authMiddleware.isAlreadyLoggedIn,
  forgotPasswordController.postForgotPasswordEmail,
)
authRouter.post(
  '/verifyForgotPasswordOtp',
  authMiddleware.isAlreadyLoggedIn,
  forgotPasswordController.postForgotPasswordOtp,
)
authRouter.post(
  '/setNewPassword',
  authMiddleware.isAlreadyLoggedIn,
  forgotPasswordController.postSetNewPassword,
)

module.exports = authRouter
