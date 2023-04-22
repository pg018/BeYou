const imgHolder = document.getElementById("avatar");
const profileImg = document.getElementById("profileImg");
const realImageContainer = document.getElementById("realImage");

imgHolder.addEventListener("change", async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    profileImg.setAttribute("src", base64)
    realImageContainer.value = base64;  
})