const currentPassword = document.getElementById('updatePass-currentPass')
const newPassword = document.getElementById('updatePass-newPass')
const confirmNewPassword = document.getElementById('updatePass-confirmNewPass')
const finalButton = document.getElementById('updatePass-confirmBtn')

const validatePasswordInput = (value) => {
  if (value.trim().length === 0) {
    return false
  }
  return true
}

const enableButton = () => {
  if (
    validatePasswordInput(currentPassword.value) &&
    validatePasswordInput(newPassword.value) &&
    validatePasswordInput(confirmNewPassword)
  ) {
    finalButton.disabled = false
  } else {
    finalButton.disabled = true
  }
}

currentPassword.addEventListener('change', (e) => {
  validatePasswordInput(e.target.value)
})
newPassword.addEventListener('change', (e) => {
  validatePasswordInput(e.target.value)
})
confirmNewPassword.addEventListener('change', (e) => {
  validatePasswordInput(e.target.value)
})

currentPassword.addEventListener('input', enableButton)
newPassword.addEventListener('input', enableButton)
confirmNewPassword.addEventListener('input', enableButton)
