const EncryptionService = require('../services/EncryptionService')
const JWTService = require('../services/JWTService')
const userModel = require('../schemas/userSchema')
const sessionsModel = require('../schemas/loginSchema')

const getLogin = (req, res) => {
  return res.render('./Pages/login', { errorMessage: '', showError: false })
}

const getRegister = (req, res) => {
  return res.render('./Pages/signUp', { error: 0 })
}

const postLogin = async (req, res) => {
  const isUserExist = await userModel.findOne({
    emailId: req.body.email,
  })
  if (!isUserExist) {
    return res.render('./Pages/login', {
      errorMessage: 'User Does Not Exist',
      showError: true,
    })
  }
  const isPasswordMatch = await EncryptionService.VerifyString(
    req.body.password,
    isUserExist.password,
  )
  if (!isPasswordMatch) {
    return res.render('./Pages/login', {
      errorMessage: 'Invalid Password',
      showError: true,
    })
  }
  const jwtToken = JWTService.SignPayload({
    userId: isUserExist._id.toString(),
  })
  // const sessionsModelObject = {
  //   userId: isUserExist._id.toString(),
  //   token: jwtToken
  // }
  // await sessionsModel(sessions)
  res.cookie('jwt', jwtToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  })
  return res.redirect('/post/posts')
}

const postRegister = async (req, res) => {
  try {
    const isUserExist = await userModel.findOne({ emailId: req.body.email })
    if (isUserExist) {
      return res.render('./Pages/signUp', { error: 1 })
    }
    console.log(req.body.pass1)
    const hashedPassword = await EncryptionService.EncryptString(req.body.pass1)
    const finalObject = {
      name: req.body.username,
      emailId: req.body.email,
      password: hashedPassword,
    }
    await userModel(finalObject).save()
    return res
      .status(200)
      .redirect('./Pages/login', { errorMessage: '', showError: false })
  } catch (err) {
    console.log(err)
    return res.render('./Pages/signUp', { error: 0 })
  }
}

const authControllers = {
  postLogin,
  getLogin,
  getRegister,
  postRegister,
}

module.exports = authControllers