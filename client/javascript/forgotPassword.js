const emailAddress = document.getElementById('emailAddressForgotPassword')
const emailError = document.getElementById('invalidEmailErr')
const otpButton = document.getElementById('otpBtn')

otpButton.disabled = true
emailError.style.display = 'none'

const validateIncomingEmailAddress = (value) => {
  if (value.length === 0) {
    return false
  }
  if (!validateEnteredEmail(value) && value.length !== 0) {
    emailError.style.display = 'block'
    return false
  }
  emailError.style.display = 'none'
  return true
}

const enableOtpButton = () => {
  if (!validateIncomingEmailAddress(emailAddress.value)) {
    otpButton.disabled = true
    emailError.innerHTML = 'Invalid Email Address'
  } else {
    otpButton.disabled = false
    localStorage.setItem('forgotPasswordEmail', emailAddress.value)
  }
}

emailAddress.addEventListener('change', (e) => {
  emailAddress.focus()
  validateIncomingEmailAddress(e.target.value)
})

emailAddress.addEventListener('input', enableOtpButton)

const verifyOtpBtn = document.getElementById('verifyOtpBtn')
const otpInput = document.getElementById('otpInput')

const enableVerifyOtpBtn = (otpValueEntered) => {
  if (
    otpValueEntered.length === 6 &&
    /\d{6}/.test(otpValueEntered) &&
    otpValueEntered.length.length !== 0
  ) {
    verifyOtpBtn.disabled = false
  } else {
    verifyOtpBtn.disabled = true
  }
}

otpInput.addEventListener('input', (e) => {
  enableVerifyOtpBtn(e.target.value)
})
