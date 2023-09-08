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
  userNonExistError.innerHTML = ""
  validateIncomingEmailAddress(e.target.value)
})

password.addEventListener('change', (e) => {
  password.focus()
  validateIncomingPassword(e.target.value)
})

emailAddress.addEventListener('input', () => {
  userNonExistError.innerHTML = ""
  enableLoginButton()
})

password.addEventListener('input', () => {
  userNonExistError.innerHTML = ""
  enableLoginButton()
})

loginButton.addEventListener('click', (e) => {
  e.preventDefault()
  const emailValue = emailAddress.value
  const passwordValue = password.value
  const xhrObj = new XMLHttpRequest()
  xhrObj.open('POST', '/auth/login')
  xhrObj.setRequestHeader('Content-Type', 'application/json')
  xhrObj.onload = () => {
    if (xhrObj.status === 200) {
      const data = JSON.parse(xhrObj.responseText)
      if (data.redirectUrl) {
        userNonExistError.innerHTML = ""
        window.location.href = data.redirectUrl
      }
    } else if (xhrObj.status === 500 || xhrObj.status === 400) {
      const response = JSON.parse(xhrObj.responseText)
      userNonExistError.innerHTML = response.errorMessage
      userNonExistError.style.color = "red"
    }
  }

  xhrObj.send(JSON.stringify({ email: emailValue, password: passwordValue }))
})
