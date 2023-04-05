const MongooseInfra = require('../infrastructure/MongooseInfra')
const EncryptionService = require('../services/EncryptionService')
const userModel = require('../schemas/userSchema')

const postLogin = async (req, res) => {
  const isUserExist = new MongooseInfra(userModel).findOne({
    emailId: req.emailId,
  })
  if (!isUserExist) {
    return res.render('./Pages/login', { error: 'User Does Not Exist' })
  }
  const isPasswordMatch = await EncryptionService.VerifyString(
    isUserExist.password,
    req.password,
  )
  if (!isPasswordMatch) {
    return res.render('./Pages/Login', { error: 'Invalid Password' })
  }
  return res.redirect('/post/posts')
}

const authControllers = {
  postLogin,
}

module.exports = authControllers
