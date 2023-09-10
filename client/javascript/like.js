const postLike = document.getElementsByClassName('post-like')
const postIds = document.getElementsByClassName('post-id')
const currentPage = document.getElementsByClassName('current-page')
const postLikeCount = document.getElementsByClassName('post-like-count')
const postLikeIcon = document.getElementsByClassName('post-like-icon')

console.log(postLike, postIds, currentPage)

for (let i = 0; i < postLike.length; i++) {
  postLike[i].addEventListener('click', (e) => {
    console.log(i, postIds[i].value, currentPage[i].value)

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(i, this.responseText)
        const response = JSON.parse(this.responseText)
        postLikeCount[i].innerHTML =
          Number(postLikeCount[i].innerHTML) + Number(response.val)
        if (Number(response.val) === -1) {
          postLikeCount[i].classList.remove('text-purple-800')
          postLikeCount[i].classList.remove('dark:text-purple-600')
          postLikeIcon[i].classList.remove('text-purple-800')
        } else {
          postLikeCount[i].classList.add('text-purple-800')
          postLikeCount[i].classList.add('dark:text-purple-600')
          postLikeIcon[i].classList.add('text-purple-800')
        }
      }
    }

    xhr.open(
      'GET',
      `/profile/likePost/${postIds[i].value}/${currentPage[i].value}`,
    )

    xhr.send()
  })
}
