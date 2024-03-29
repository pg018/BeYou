const title = document.getElementById('addPostTitle')
const description = document.getElementById('addPostDescription')
const addPostBtn = document.getElementById('addPostButton')

const titleError = document.getElementById('titleError')
const descriptionError = document.getElementById('descriptionError')

const postImagePicker = document.getElementById('postImagePicker')
const postImageContainer = document.getElementById('postImageContainer')
const postImagePreview = document.getElementById('postImagePreview')
const addPostOverlay = document.getElementById('authentication-modal')

addPostBtn.disabled = true
titleError.style.display = 'none'
descriptionError.style.display = 'none'

const postTitleValidator = (inputValue) => {
  if (inputValue.length === 0) {
    titleError.style.display = 'none'
  }
  if (inputValue.trim().length !== 0 && inputValue.length !== 0) {
    titleError.style.display = 'none'
    return true
  }
  titleError.style.display = 'block'
  return false
}

const postDescriptionValidator = (inputValue) => {
  if (inputValue.trim().length !== 0 && inputValue.length !== 0) {
    descriptionError.style.display = 'none'
    return true
  }
  descriptionError.style.display = 'block'
  return false
}

const enableAddPostButton = () => {
  if (
    !postTitleValidator(title.value) ||
    !postDescriptionValidator(description.value)
  ) {
    addPostBtn.disabled = true
  } else {
    addPostBtn.disabled = false
  }
}

title.addEventListener('change', (e) => {
  postTitleValidator(e.target.value)
})

description.addEventListener('change', (e) => {
  postDescriptionValidator(e.target.value)
})

title.addEventListener('input', enableAddPostButton)
description.addEventListener('input', enableAddPostButton)

postImagePicker.addEventListener('change', async (e) => {
  const files = e.target.files
  for (let i = 0; i < files.length; i++) {
    const img = await convertToBase64(e.target.files[i])
    const imgNode = document.createElement('img')
    imgNode.setAttribute('src', img)
    imgNode.setAttribute('id', 'userUploadedImage')
    imgNode.classList.add(['h-[200px]', 'max-w-full'])
    postImagePreview.appendChild(imgNode)
    postImageContainer.value += `${img} `
  }
})

addPostOverlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('addPostClose')) {
    postImagePreview.innerHTML = ''
    postImageContainer.value = ''
  }
})

addPostBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const xhrObject = new XMLHttpRequest()
  const titleValue = title.value
  const descriptionValue = description.value
  const imageNode = document.getElementById('userUploadedImage')

  xhrObject.open('POST', '/post/addPost')
  xhrObject.setRequestHeader('Content-Type', 'application/json')
  xhrObject.onload = () => {
    if (xhrObject.status === 201) {
      window.location.href = '/post/posts'
    } else {
      alert('Error! Please Try Again Later')
    }
  }

  xhrObject.send(
    JSON.stringify({
      postTitle: titleValue,
      postDescription: descriptionValue,
      uploadedImages: imageNode === null ? '' : imageNode.src,
    }),
  )
})
