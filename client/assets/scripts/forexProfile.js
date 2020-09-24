const btn = document.getElementById('btnMash');
const infoBtn = document.querySelector('#infoBtn');
const inputBtn = document.querySelector('#inputBtn')

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
    console.log(currentUser)
    usernameHeader.innerHTML = currentUserObj.userUsername;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
});

function getUserInfo(){
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            console.log(data);
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
            
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    console.log(currentUserObj.userId);

    xhttp.open('GET', `http://127.0.0.1:8577/api/members/user/${currentUserObj.userId}`);

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
}

window.onload = getUserInfo;