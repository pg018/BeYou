const isUserExistsWithEmail = (enteredEmail) => {
  const userData = users.find((u) => u.emailAddress === enteredEmail)
  if (userData === undefined) {
    return null
  }
  return userData
}
