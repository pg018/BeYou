const jwt = require('jsonwebtoken')

class JWTService {
  static SignPayload(payload) {
    return jwt.sign(payload, 'secretKey', { expiresIn: 3600000 }) // 1hr
  }

  static GetDecodedToken(token) {
    return jwt.decode(token, { json: true })
  }

  static VerifyPayload(tokenPayload) {
    try {
      const verifiedToken = jwt.decode(tokenPayload, { json: true })
      if (!verifiedToken) {
        return undefined
      }
      const timeDecided = verifiedToken.exp
      const timeHappened = new Date().getTime() / 1000
      if (timeHappened > timeDecided) {
        return true // expired
      }
      return false
    } catch (error) {
      throw new Error('Create custom jwt token error')
    }
  }
}

module.exports = JWTService
