const btn = document.getElementById('btnMash');
const infoBtn = document.querySelector('#infoBtn');
const inputBtn = document.querySelector('#inputBtn');
const usernameAvatar = document.getElementById('usernameAvatar');

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

const profileFirstNameInput = document.getElementById('profileFirstNameInput');
const profileLastNameInput = document.getElementById('profileLastNameInput');
const profileEmailInput = document.getElementById('profileEmailInput');
const profilePhoneInput = document.getElementById('profilePhoneInput');
const profileBirthdayInput = document.getElementById('profileBirthdayInput');
const profileUsernameInput = document.getElementById('profileUsernameInput');

const profileDeleteBtn = document.getElementById('profileDeleteBtn');
const profileUpdateBtn = document.getElementById('profileUpdateBtn');


function populateUsername(){
    //console.log(currentUser)
    usernameHeader.innerHTML = `<a href="http://127.0.0.1:5500/client/profile.html">${currentUserObj.userUsername}</a>`;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
    localStorage.removeItem('searchedUser');
});

function getUserInfo(){
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            //console.log(data);
            infoBtn.innerHTML = `
                <div class="flex fxBetween">
                    <h4 id="">First Name: </h4>
                    <h4 id="">${data.userFirstName}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Last Name: </h4>
                    <h4 id="">${data.userLastName}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Email: </h4>
                    <h4 id="">${data.userEmail}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Phone Number: </h4>
                    <h4 id="">${data.userPhone}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Birthday: </h4>
                    <h4 id="">${data.userBirthDay}</h4>
                </div>
                <div class="flex fxBetween">
                    <h4 id="">Username: </h4>
                    <h4 id="">${data.userUsername}</h4>
                </div>
            `;

            profileFirstNameInput.value = `${data.userFirstName}`;
            profileLastNameInput.value = `${data.userLastName}`;
            // profileEmailInput.value = `${data.userEmail}`;
            profilePhoneInput.value = `${data.userPhone}`;
            profileBirthdayInput.value = `${data.userBirthDay}`;
            profileUsernameInput.value = `${data.userUsername}`;

            // two templates for admins and users

            
            usernameAvatar.innerHTML = `${data.userUsername}`;
            //usernameHeader.innerHTML = `${data.userUsername}`;
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    //console.log(currentUserObj.userId);

    xhttp.open('GET', `http://127.0.0.1:8577/api/members/user/${currentUserObj.userId}`);

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
}

window.onload = getUserInfo;


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
                //console.log('we are here in the fe')
                alertBox.innerHTML = `Posting successful`;
                const data = JSON.parse(xhttp.responseText);
                //console.log(data);
                location.reload(); // forward to the actual post page
            }
            if(this.readyState == 4 && this.status >= 400){
                alertBox.innerHTML = `Posting unsuccessful, error: ${this.status}`;
            }
        };

        xhttp.open('PUT', `http://127.0.0.1:8577/api/members/user/${currentUserObj.userId}`);
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

// profileDeleteBtn.addEventListener('click', (e)=>{
//     e.preventDefault();

    
//     const xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function(){
//         if (this.readyState == 4 && this.status == 200){
//             //console.log('we are here in the fe')
//             location.href = 'http://127.0.0.1:5500/client/posts.html'; // forward to the actual post page
//         }
//         if(this.readyState == 4 && this.status >= 400){
//             alertBox.innerHTML = `Unauthorized personel ${this.status}`;
//             //location.href = 'http://127.0.0.1:5500/client/posts.html';
//         }
//     };

//     xhttp.open('DELETE', `http://127.0.0.1:8577/api/admins/user/${currentUserObj.userId}`);
//     xhttp.setRequestHeader('Content-Type', 'application/json');

//     if (localStorage.getItem('currentUser')){
//         const {token} = JSON.parse(localStorage.getItem('currentUser'));
//         xhttp.setRequestHeader('x-authentication-token', token);
//     }
//     xhttp.send();
    
// });