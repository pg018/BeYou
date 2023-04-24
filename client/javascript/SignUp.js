let emailInput = document.getElementById('signup-email')
let passwordInput = document.getElementById('signup-password')
let confirmPasswordInput = document.getElementById('signup-confirm-password')
let submit = document.getElementById('signup-submit')
let alerts = document.getElementsByClassName('error-message')
let formSign = document.getElementById("formSign");
let usernameInput= document.getElementById("signup-username")

let email = ''
let username= ''
let password = ''
let confirmPassword = ''


submit.disabled = true

function buttonToggler(email, username ,password, confirmPassword) {
  if (
    validateEnteredEmail(email) &&
    validateEnteredUsername(username)&&
    validateEnteredPassword(password) &&
    validateEnteredPassword(confirmPassword) &&
    confirmPassword === password
  ) {
    submit.disabled = false
  }
}
  
usernameInput.addEventListener('change', (e) => {
  username = e.target.value

  if (!validateEnteredUsername(e.target.value)) {
    alerts[0].style.display = 'block'
  } else {
    alerts[0].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})


emailInput.addEventListener('change', (e) => {
  email = e.target.value
  if (!validateEnteredEmail(e.target.value)) {
    alerts[1].style.display = 'block'
  } else {
    alerts[1].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})


passwordInput.addEventListener('change', (e) => {
  password = e.target.value
  if (!validateEnteredPassword(e.target.value)) {
    alerts[2].style.display = 'block'
  } else {
    alerts[2].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})

confirmPasswordInput.addEventListener('change', (e) => {
  confirmPassword = e.target.value
  if (password !== confirmPassword) {
    alerts[3].style.display = 'block'
  } else {
    alerts[3].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})





