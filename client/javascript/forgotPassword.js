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
    emailError.innerHTML = "Invalid Email Address"
  } else {
    otpButton.disabled = false
  }
}

emailAddress.addEventListener('change', (e) => {
  emailAddress.focus()
  validateIncomingEmailAddress(e.target.value)
})

emailAddress.addEventListener('input', enableOtpButton)
