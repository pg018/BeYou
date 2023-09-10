let emailInput = document.getElementById('signup-email')
let passwordInput = document.getElementById('signup-password')
let confirmPasswordInput = document.getElementById('signup-confirm-password')
let submit = document.getElementById('signup-submit')
let alerts = document.getElementsByClassName('error-message')
let formSign = document.getElementById("formSign");
let usernameInput= document.getElementById("signup-username")
let errMessage = document.getElementsByClassName("err-message");

let email = ''
let username= ''
let password = ''
let confirmPassword = ''


submit.disabled = true
errMessage[0].style.display = "none";
errMessage[1].style.display = "none";

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
  errMessage[0].style.display = "none";
  errMessage[1].style.display = "none";

  username = e.target.value

  if (!validateEnteredUsername(e.target.value)) {
    alerts[0].style.display = 'block'
  } else {
    alerts[0].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})


emailInput.addEventListener('change', (e) => {
  errMessage[0].style.display = "none";
  errMessage[1].style.display = "none";
  email = e.target.value
  if (!validateEnteredEmail(e.target.value)) {
    alerts[1].style.display = 'block'
  } else {
    alerts[1].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})


passwordInput.addEventListener('change', (e) => {
  errMessage[0].style.display = "none";
  errMessage[1].style.display = "none";
  password = e.target.value
  if (!validateEnteredPassword(e.target.value)) {
    alerts[2].style.display = 'block'
  } else {
    alerts[2].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})

confirmPasswordInput.addEventListener('change', (e) => {
  errMessage[0].style.display = "none";
  errMessage[1].style.display = "none";
  confirmPassword = e.target.value
  if (password !== confirmPassword) {
    alerts[3].style.display = 'block'
  } else {
    alerts[3].style.display = 'none'
    buttonToggler(email, username, password, confirmPassword)
  }
})

formSign.addEventListener("submit", (e) => {
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 409) {
      errMessage[0].style.display = "block";
    }

    if (this.readyState === 4 && this.status === 500) {
      errMessage[1].style.display = "block";
    }

    if (this.readyState === 4 && this.status === 200) {
      window.location.href = "http://localhost:5000/auth/login";
    }
  }

  xhr.open("POST", "http://localhost:5000/auth/signup");
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(`email=${email}&username=${username}&pass1=${password}`);
})





