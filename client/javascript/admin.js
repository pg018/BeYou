const totalAccounts = document.getElementById("adminModal1");
const totalBlockedAccounts = document.getElementById("adminModal2");
const totalVerifiedAccounts = document.getElementById("adminModal3");

function showModal(id){
    if(id=='box1'){
        totalAccounts.classList.toggle('hiddenModal')
    }
    else if(id=='box2'){
        totalBlockedAccounts.classList.toggle('hiddenModal')
    }
    else if(id=='box3'){
        totalVerifiedAccounts.classList.toggle('hiddenModal')
    }
}