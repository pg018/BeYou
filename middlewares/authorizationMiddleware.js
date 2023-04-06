const JWTService = require('../services/JWTService')

const verifyLogin = async (req, res, next) => {
  const jwtCookie = req.cookies.jwt
  if (!jwtCookie) {
    return res
      .status(401)
      .redirect('/auth/login')
  }
  const isTokenExpired = JWTService.VerifyPayload(jwtCookie)
  if (isTokenExpired) {
    res.clearCookie('jwt')
    return res
      .status(401)
      .redirect('/auth/login')
  }
  next()
}

const isAlreadyLoggedIn = async (req, res, next) => {
  const jwtCookie = req.cookies.jwt
  if (!jwtCookie) {
    return next()
  }
  const isTokenExpired = JWTService.VerifyPayload(jwtCookie)
  if (isTokenExpired) {
    res.clearCookie('jwt')
    return next()
  }
  return res.redirect('/post/posts')
}

module.exports = {
  verifyLogin,
  isAlreadyLoggedIn,
}
