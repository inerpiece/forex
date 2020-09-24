// const btn = document.getElementById('btnMash');
// const infoBtn = document.querySelector('#infoBtn');
// const inputBtn = document.querySelector('#inputBtn')

// btn.addEventListener('click', ()=>{
//     if (infoBtn.classList.contains('hidden')){
//         infoBtn.classList.remove('hidden');
//         inputBtn.classList.add('hidden')
//     } else {
//         infoBtn.classList.add('hidden');
//         inputBtn.classList.remove('hidden');
//     }
// });

const logoutButton = document.getElementById('logoutButton');
const usernameHeader =  document.getElementById('usernameHeader');
const localStorage = window.localStorage;
const currentUser = window.localStorage.getItem('currentUser');
const currentUserObj = JSON.parse(currentUser);


function populateUsername(){
    console.log(currentUser)
    usernameHeader.innerHTML = currentUserObj.userUsername;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
});