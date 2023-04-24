let subInput= document.getElementById("report-subject")
let desInput= document.getElementById("report-description")
let error = document.getElementsByClassName('error');
let submit = document.getElementById('report-submit')


let sub=''
let des=''

submit.disabled = true

function buttonToggler(sub, des) {
  if (
    validateEnteredUsername(sub)&&
    validateEnteredUsername(des)
  ) {
    submit.disabled = false
  }
}

subInput.addEventListener('change', (e) => {
    sub = e.target.value
    console.log('h')
    if (!validateEnteredUsername(e.target.value)) {
      error[0].style.display = 'block'
    } else {
      error[0].style.display = 'none'
      buttonToggler(sub, des)
    }
  })
  
  desInput.addEventListener('change', (e) => {
    des = e.target.value
    console.log('h')
  
    if (!validateEnteredUsername(e.target.value)) {
      error[1].style.display = 'block'
    } else {
      error[1].style.display = 'none'
      buttonToggler(sub, des)

    }
  })