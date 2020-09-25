const logoutButton = document.getElementById('logoutButton');
const usernameHeader =  document.getElementById('usernameHeader');
const localStorage = window.localStorage;
const currentUser = window.localStorage.getItem('currentUser');
const currentUserObj = JSON.parse(currentUser);
const usersPanel = document.getElementById('usersPanel');

//const loadedWindow = window.onload();


function populateUsername(){
    // console.log(currentUser)
    usernameHeader.innerHTML = `<a href="http://127.0.0.1:5500/client/profile.html">${currentUserObj.userUsername}</a>`;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
    localStorage.removeItem('searchedUser');
});

function getUsers(){
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            // console.log(data);
            data.forEach(data => {
                if(data.role.roleName == 'Admin'){
                    // console.log(data);
                    usersPanel.innerHTML += `
                    <a href=""><div class="flex post">
                    <i class="fa fa-user-o fa-2x admin" aria-hidden="true"></i>
                    <h3 id="" class="admin">${data.userUsername}</h3>
                    <h3 id="" class="admin">ID: ${data.userId}</h3>
                    </div></a>`;
                } else if (data.role.roleName == 'Mod') {
                    // console.log(data);
                    usersPanel.innerHTML += `
                    <a href=""><div class="flex post">
                    <i class="fa fa-user-o fa-2x mod" aria-hidden="true"></i>
                    <h3 id="" class="mod">${data.userUsername}</h3>
                    <h3 id="" class="mod">ID: ${data.userId}</h3>
                    </div></a>`;
                } else {
                    // console.log(data);
                    usersPanel.innerHTML += `
                    <a href=""><div class="flex post">
                    <i class="fa fa-user-o fa-2x" aria-hidden="true"></i>
                    <h3 id="">${data.userUsername}</h3>
                    <h3 id="">ID: ${data.userId}</h3>
                    </div></a>`;
                }
                
            });
            
            
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            usersPanel.innerHTML = "Can't view all users. Not authorized";
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    xhttp.open('GET', 'http://127.0.0.1:8577/api/admins/users');

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
}

window.onload = getUsers;








const userSearchValue = document.getElementById('userSearchValue');
const userSearchValueBtn = document.getElementById('userSearchValueBtn');
const userProfileDetails = document.getElementById('userProfileDetails');



function getSearchUser(){
    const xhttp = new XMLHttpRequest();
    // console.log(`we are here, ${userSearchValue.value}`);
    xhttp.onreadystatechange = function (){
        
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            localStorage.setItem(`searchedUser`, xhttp.responseText);
            location.href = `http://127.0.0.1:5500/client/userProfile.html?${data.userId}`
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    //console.log(currentUserObj.userId);
    
    xhttp.open('GET', `http://127.0.0.1:8577/api/members/user/${userSearchValue.value}`);

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
}

userSearchValueBtn.addEventListener('click', function(){
    getSearchUser();
    
});


//exports.userSearchValue = userSearchValue;