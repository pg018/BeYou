const settingsCurrentPassword = document.getElementById('updatePass-currentPass')
const settingsNewPassword = document.getElementById('updatePass-newPass')
const settingsConfirmNewPassword = document.getElementById('updatePass-confirmNewPass')
const settingsFinalButton = document.getElementById('updatePass-confirmBtn')



const validatePasswordInput = (value) => {
  if (value.trim().length === 0) {
    return false
  }
  return true
}

settingsFinalButton.disabled = true

const enableButton = () => {
  if (
    validatePasswordInput(settingsCurrentPassword.value) &&
    validatePasswordInput(settingsNewPassword.value) &&
    validatePasswordInput(settingsConfirmNewPassword.value)
  ) {
    settingsFinalButton.disabled = false
  } else {
    settingsFinalButton.disabled = true
  }
}

settingsCurrentPassword.addEventListener('change', (e) => {
  validatePasswordInput(e.target.value)
})
settingsNewPassword.addEventListener('change', (e) => {
  validatePasswordInput(e.target.value)
})
settingsConfirmNewPassword.addEventListener('change', (e) => {
  validatePasswordInput(e.target.value)
})

settingsCurrentPassword.addEventListener('input', enableButton)
settingsNewPassword.addEventListener('input', enableButton)
settingsConfirmNewPassword.addEventListener('input', enableButton)
