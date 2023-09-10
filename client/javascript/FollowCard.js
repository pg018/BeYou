const followUserButtons = document.getElementsByClassName('follow-user-btn')
const userIds = document.getElementsByClassName('friendOptionsId')

for (let i = 0; i < followUserButtons.length; i++) {
  followUserButtons[i].addEventListener('click', (e) => {
    e.preventDefault()
    const finalUrl = `/post/addFriend/${userIds[i].value}`
    const xhrObject = new XMLHttpRequest()

    xhrObject.open('GET', finalUrl)
    xhrObject.setRequestHeader('Content-Type', 'application/json')
    xhrObject.onload = () => {
      if (xhrObject.status === 200) {
        const dataResponse = JSON.parse(xhrObject.responseText)
        followUserButtons[i].innerHTML = dataResponse.message
      }
    }
    xhrObject.send()
  })
}
