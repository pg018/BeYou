const replyContainer = document.getElementById("reply");
const replyToggler = document.getElementById("reply-toggler");

replyToggler.addEventListener("click", (e) => {
    replyContainer.classList.toggle("hidden");
})