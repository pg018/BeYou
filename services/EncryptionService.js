const bcrypt = require('bcrypt')

class EncryptionService {
  static async EncryptString(incomingString) {
    return await bcrypt.hash(incomingString, 12)
  }

  static async VerifyString(incomingString, originalHashValue) {
    return await bcrypt.compare(incomingString, originalHashValue)
  }
}

module.exports = EncryptionService
