const btn = document.getElementById('btnMash');
const infoBtn = document.querySelector('#infoBtn');
const inputBtn = document.querySelector('#inputBtn');
const usernameAvatar = document.getElementById('usernameAvatar');

//const somethingValue = require('./forexUsers')


const profileFirstNameInput = document.getElementById('profileFirstNameInput');
const profileLastNameInput = document.getElementById('profileLastNameInput');
const profileEmailInput = document.getElementById('profileEmailInput');
const profilePhoneInput = document.getElementById('profilePhoneInput');
const profileBirthdayInput = document.getElementById('profileBirthdayInput');
const profileUsernameInput = document.getElementById('profileUsernameInput');

const profileDeleteBtn = document.getElementById('profileDeleteBtn');
const profileUpdateBtn = document.getElementById('profileUpdateBtn');

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
//console.log(searchedUser)
const sUser = JSON.parse(searchedUser);
//console.log(sUser);
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

            profileFirstNameInput.value = `${data.userFirstName}`;
            profileLastNameInput.value = `${data.userLastName}`;
            // profileEmailInput.value = `${data.userEmail}`;
            profilePhoneInput.value = `${data.userPhone}`;
            profileBirthdayInput.value = `${data.userBirthDay}`;
            profileUsernameInput.value = `${data.userUsername}`;
            usernameAvatar.innerHTML = `${sUser.userUsername}`;
            //location.href = `http://127.0.0.1:5500/client/userProfile.html?${searchedUser.userId}`
            // can do any kind of DOM or other manipulation here with the data
            //usernameHeader.innerHTML = `${data.userUsername}`;
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

profileUpdateBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    if(!(profileFirstNameInput.value && profileLastNameInput.value && profileUsernameInput.value && profilePhoneInput.value)){
        alertBox.innerHTML = "Please have all necessary fields filled!";
        setTimeout(function () {
            alertBox.innerHTML = alertBox.innerHTML.replace("Please have all necessary fields filled!", "");  
        }, 2000);
    } else {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                // console.log('we are here in the fe')
                alertBox.innerHTML = `Posting successful`;
                const data = JSON.parse(xhttp.responseText);
                // console.log(data);
                location.href = 'http://127.0.0.1:5500/client/users.html'; // forward to the actual post page
            }
            if(this.readyState == 4 && this.status >= 400){
                alertBox.innerHTML = `Posting unsuccessful, error: ${this.status}`;
            }
        };

        xhttp.open('PUT', `http://127.0.0.1:8577/api/members/user/${sUser.userId}`);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        if (localStorage.getItem('currentUser')){
            const {token} = JSON.parse(localStorage.getItem('currentUser'));
            xhttp.setRequestHeader('x-authentication-token', token);
        }

        const payload = {
            // userEmail: profileEmailInput.value,
            userFirstName: profileFirstNameInput.value,
            userLastName: profileLastNameInput.value,
            userUsername: profileUsernameInput.value,
            userPhone: profilePhoneInput.value,
            userBirthDay: profileBirthdayInput.value
        }

        xhttp.send(JSON.stringify(payload));
    }
});


profileDeleteBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            // console.log('we are here in the fe')
            location.href = 'http://127.0.0.1:5500/client/users.html'; // forward to the actual post page
        }
        if(this.readyState == 4 && this.status >= 400){
            alertBox.innerHTML = `Unauthorized personel ${this.status}`;
            //location.href = 'http://127.0.0.1:5500/client/posts.html';
        }
    };

    xhttp.open('DELETE', `http://127.0.0.1:8577/api/admins/user/${sUser.userId}`);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
        // const {role} = JSON.parse(localStorage.getItem('currentUser'));
        // console.log(role);
    }
    xhttp.send();
    
});