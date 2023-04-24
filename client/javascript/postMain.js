const replyContainer = document.getElementsByClassName("reply");
const replyToggler = document.getElementsByClassName("reply-toggler");


for (let i = 0; i < replyToggler.length; i++) {
    replyToggler[i].addEventListener("click", (e) => {
        replyContainer[i].classList.toggle("hidden");
    })
}