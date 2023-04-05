const bcrypt = require('bcrypt')

class EncryptionService {
  static async EncryptString(incomingString) {
    return await bcrypt.hash(incomingString, 12)
  }

  static async VerifyString(originalHashValue, incomingString) {
    return await bcrypt.compare(originalHashValue, incomingString)
  }
}

module.exports = EncryptionService
