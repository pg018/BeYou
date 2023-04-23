const title = document.getElementById('addPostTitle')
const description = document.getElementById('addPostDescription')
const addPostBtn = document.getElementById('addPostButton')

const titleError = document.getElementById('titleError')
const descriptionError = document.getElementById('descriptionError')

const postImagePicker = document.getElementById("postImagePicker");
const postImageContainer = document.getElementById("postImageContainer");
const postImagePreview = document.getElementById("postImagePreview");

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


postImagePicker.addEventListener("change", async (e) => {
  const img = await convertToBase64(e.target.files[0]);
  postImagePreview.setAttribute("src", img);
  postImageContainer.value = img;
});