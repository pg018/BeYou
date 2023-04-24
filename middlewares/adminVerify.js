const JWTService = require('../services/JWTService')
const userModel = require('../schemas/userSchema')

const isAdmin = async (req, res, next) => {
  const jwtCookie = req.cookies.jwt
  let isUserAdmin
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const thisUser = await new Promise((resolve) =>
    resolve(
      userModel.findOne({ stringId: userId }).then((user) => {
        isUserAdmin = user.admin
      }),
    ),
  )
  if (isUserAdmin) {
    next()
  } else {
    res.render('./Pages/notFoundError')
  }
}

module.exports = {
  isAdmin,
}
