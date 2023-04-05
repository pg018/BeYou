const jwt = require('jsonwebtoken')

class JWTService {
  mySecretKey = 'secretKey'

  static SignPayload(payload) {
    return jwt.sign(payload, mySecretKey, { expiresIn: 500 })
  }

  static VerifyPayload(tokenPayload) {
    try {
      return jwt.verify(tokenPayload, mySecretKey)
    } catch (error) {
      throw new Error('Create custom jwt token error')
    }
  }
}

module.exports = JWTService
