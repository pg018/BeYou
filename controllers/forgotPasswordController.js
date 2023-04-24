const userModel = require('../schemas/userSchema')
const forgotPasswordModel = require('../schemas/forgotPasswordSchema')
const EmailService = require('../services/EmailService')
const EncryptionService = require('../services/EncryptionService')

const getForgotPassword = (req, res) => {
  return res.render('./Pages/forgotPassword', {
    showOTP: false,
    errorMessage: '',
    showNewPassword: false,
  })
}

const postForgotPasswordEmail = async (req, res) => {
  const enteredEmailId = req.body.email
  const isUserExist = await userModel.findOne({ emailId: enteredEmailId })
  if (!isUserExist) {
    return res.render('./Pages/forgotPassword', {
      showOTP: false,
      errorMessage: 'User Does Not Exist',
      showNewPassword: false,
    })
  }
  const sixDigitOtp = Math.floor(100000 + Math.random() * 900000)
  const finalSchemaObject = {
    emailId: enteredEmailId,
    otpCode: sixDigitOtp,
  }
  await forgotPasswordModel(finalSchemaObject).save()
  new EmailService().sendMail(
    enteredEmailId,
    'Forgot Password OTP',
    `The otp is ${sixDigitOtp}. It will expire in 2 minutes`,
  )
  res.cookie('forgotPassEmail', enteredEmailId)
  return res.render('./Pages/forgotPassword', {
    showOTP: true,
    errorMessage: '',
    showNewPassword: false,
  })
}

const postForgotPasswordOtp = async (req, res) => {
  const enteredOtp = req.body.otpInput
  const emailAddress = req.cookies.forgotPassEmail
  const forgotPasswordDoc = await forgotPasswordModel.findOne({
    emailId: emailAddress,
  })
  if (!forgotPasswordDoc) {
    return res.render('./Pages/forgotPassword', {
      showOTP: false,
      errorMessage: '',
      showNewPassword: false,
    })
  }
  console.log(forgotPasswordDoc.otpCode)
  if (Number(enteredOtp) !== Number(forgotPasswordDoc?.otpCode)) {
    return res.render('./Pages/forgotPassword', {
      showOTP: true,
      errorMessage: 'Invalid OTP',
      showNewPassword: false,
    })
  }
  return res.render('./Pages/forgotPassword', {
    showOTP: false,
    errorMessage: '',
    showNewPassword: true,
  })
}

const postSetNewPassword = async (req, res) => {
  const enteredNewPassword = req.body.newPassword
  const userEmailId = req.cookies.forgotPassEmail
  console.log(enteredNewPassword)
  console.log(userEmailId)
  const hashedPassword = await EncryptionService.EncryptString(
    enteredNewPassword,
  )
  await userModel.findOneAndUpdate(
    { emailId: userEmailId },
    { password: hashedPassword },
  )
  res.clearCookie('forgotPassEmail')
  return res.status(200).redirect('/auth/login')
}

const forgotPasswordController = {
  getForgotPassword,
  postForgotPasswordEmail,
  postForgotPasswordOtp,
  postSetNewPassword,
}

module.exports = forgotPasswordController
