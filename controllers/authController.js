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

// const postLogin = async (req, res) => {
//   const isUserExist = await userModel.findOne({
//     emailId: req.body.email,
//   })
//   if (!isUserExist) {
//     return res.render('./Pages/login', {
//       errorMessage: 'User Does Not Exist',
//       showError: true,
//     })
//   }
//   const isPasswordMatch = await EncryptionService.VerifyString(
//     req.body.password,
//     isUserExist.password,
//   )
//   if (!isPasswordMatch) {
//     return res.render('./Pages/login', {
//       errorMessage: 'Invalid Password',
//       showError: true,
//     })
//   }
//   const jwtToken = JWTService.SignPayload({
//     userId: isUserExist._id.toString(),
//   })
//   res.cookie('jwt', jwtToken, {
//     httpOnly: true,
//     secure: true,
//     expires: new Date(Date.now() + 60 * 60 * 1000),
//   })
//   return res.redirect('/post/posts')
// }

const postLogin = async (req, res) => {
  try {
    const isUserExist = await userModel.findOne({
      emailId: req.body.email,
    })
    if (!isUserExist) {
      return res.status(400).json({
        errorMessage: 'User Does Not Exist',
        showError: true,
      })
    }
    const isPasswordMatch = await EncryptionService.VerifyString(
      req.body.password,
      isUserExist.password,
    )
    if (!isPasswordMatch) {
      return res.status(400).json({
        errorMessage: 'Invalid Password',
        showError: true,
      })
    }
    const jwtToken = JWTService.SignPayload({
      userId: isUserExist._id.toString(),
    })
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    })
    return res.status(200).json({
      message: 'Login successful',
      redirectUrl: '/post/posts',
    })
  } catch (error) {
    return res.status(500).json({
      errorMessage: 'Internal Server Error',
      showError: true,
    })
  }
}

const postRegister = async (req, res) => {
  console.log(req.body);
  try {
    const isUserExist = await userModel.findOne({
      $or: [{ emailId: req.body.email }, { username: req.body.username }],
    })

    if (isUserExist) {
      return res.status(409).send();
    }


    const hashedPassword = await EncryptionService.EncryptString(req.body.pass1)
    const finalObject = {
      username: req.body.username,
      emailId: req.body.email,
      password: hashedPassword,
    }
    await userModel(finalObject).save()
    return res.status(200).send();
  } catch (err) {
    console.log(err)
    return res.status(500).send();
  }
}

const getSignOut = async (req, res) => {
  res.clearCookie('jwt')
  return res.redirect('/auth/login')
}

const authControllers = {
  postLogin,
  getLogin,
  getRegister,
  postRegister,
  getSignOut,
}

module.exports = authControllers
