const btn = document.getElementById('btnMash');
const infoBtn = document.querySelector('#infoBtn');
const inputBtn = document.querySelector('#inputBtn');
const usernameAvatar = document.getElementById('usernameAvatar');

//const somethingValue = require('./forexUsers')

//const userSearchValue = document.getElementById('userSearchValue');
//const userSearchValueBtn = document.getElementById('userSearchValueBtn');
const userProfileDetails = document.getElementById('userProfileDetails');

btn.addEventListener('click', ()=>{
    if (infoBtn.classList.contains('hidden')){
        infoBtn.classList.remove('hidden');
        inputBtn.classList.add('hidden')
    } else {
        infoBtn.classList.add('hidden');
        inputBtn.classList.remove('hidden');
    }
});


const logoutButton = document.getElementById('logoutButton');
const usernameHeader =  document.getElementById('usernameHeader');
const localStorage = window.localStorage;
const currentUser = window.localStorage.getItem('currentUser');
const currentUserObj = JSON.parse(currentUser);
const userDetails = document.getElementById('userDetails');


function populateUsername(){
    //console.log(currentUser)
    usernameHeader.innerHTML = `<a href="http://127.0.0.1:5500/client/profile.html">${currentUserObj.userUsername}</a>`;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
    localStorage.removeItem('searchedUser');
});
const searchedUser = localStorage.getItem('searchedUser');
console.log(searchedUser)
const sUser = JSON.parse(searchedUser);
console.log(sUser);
function getSearchUser(){
    const xhttp = new XMLHttpRequest();
    //console.log(`we are here, ${userSearchValue.value}`);
    xhttp.onreadystatechange = function (){
        
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            
            //console.log(data);
            infoBtn.innerHTML = `
                <div class="flex fxBetween">
                    <h4 id="">First Name: </h4>
                    <h4 id="">${sUser.userFirstName}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Last Name: </h4>
                    <h4 id="">${sUser.userLastName}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Email: </h4>
                    <h4 id="">${sUser.userEmail}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Phone Number: </h4>
                    <h4 id="">${sUser.userPhone}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Birthday: </h4>
                    <h4 id="">${sUser.userBirthDay}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Username: </h4>
                    <h4 id="">${sUser.userUsername}</h4>
                </div>
            `;
            usernameAvatar.innerHTML = `${sUser.userUsername}`;
            //location.href = `http://127.0.0.1:5500/client/userProfile.html?${searchedUser.userId}`
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            //console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    //console.log(currentUserObj.userId);
    
    xhttp.open('GET', `http://127.0.0.1:8577/api/members/user/${sUser.userId}`);

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
}

window.onload = getSearchUser;

