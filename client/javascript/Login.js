const emailAddress = document.getElementById('emailAddress')
const password = document.getElementById('enteredPassword')
const loginButton = document.getElementById('loginBtn')

const userNonExistError = document.getElementById('userNonExistError')
const emailError = document.getElementById('emailError')
const passwordError = document.getElementById('passwordError')

loginButton.disabled = true

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

const validateIncomingPassword = (value) => {
  if (value.length === 0) {
    return false
  }
  if (value.length < 8 && value.length !== 0) {
    passwordError.style.display = 'block'
    return false
  }
  passwordError.style.display = 'none'
  return true
}

const enableLoginButton = () => {
  if (
    !validateIncomingEmailAddress(emailAddress.value) ||
    !validateIncomingPassword(password.value)
  ) {
    loginButton.disabled = true
  } else {
    loginButton.disabled = false
  }
}

emailAddress.addEventListener('change', (e) => {
  emailAddress.focus()
  validateIncomingEmailAddress(e.target.value)
})

password.addEventListener('change', (e) => {
  password.focus()
  validateIncomingPassword(e.target.value)
})

emailAddress.addEventListener('input', enableLoginButton)
password.addEventListener('input', enableLoginButton)
