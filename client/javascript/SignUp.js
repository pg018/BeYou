let emailInput = document.getElementById('signup-email')
let passwordInput = document.getElementById('signup-password')
let confirmPasswordInput = document.getElementById('signup-confirm-password')
let submit = document.getElementById('signup-submit')
let alerts = document.getElementsByClassName('error-message')
let formSign = document.getElementById("formSign");
let usernameInput= document.getElementById("signup-username")
let subInput= document.getElementById("report-subject")
let desInput= document.getElementById("report-description")
let error = document.getElementsByClassName('error');
console.log(emailInput)
let email = ''
let username= ''
let password = ''
let confirmPassword = ''
let sub=''
let des=''

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

subInput.addEventListener('change', (e) => {
  sub = e.target.value
  console.log('h')
  if (!validateEnteredUsername(e.target.value)) {
    error[0].style.display = 'block'
  } else {
    error[0].style.display = 'none'
  }
})

desInput.addEventListener('change', (e) => {
  des = e.target.value
  console.log('h')

  if (!validateEnteredUsername(e.target.value)) {
    error[1].style.display = 'block'
  } else {
    error[1].style.display = 'none'
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





