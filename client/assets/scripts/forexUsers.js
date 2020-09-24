const logoutButton = document.getElementById('logoutButton');
const usernameHeader =  document.getElementById('usernameHeader');
const localStorage = window.localStorage;
const currentUser = window.localStorage.getItem('currentUser');
const currentUserObj = JSON.parse(currentUser);
const usersPanel = document.getElementById('usersPanel');

//const loadedWindow = window.onload();


function populateUsername(){
    console.log(currentUser)
    usernameHeader.innerHTML = currentUserObj.userUsername;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
});

function getUsers(){
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            console.log(data);
            data.forEach(data => {
                console.log(data);
                usersPanel.innerHTML += `
                <a href=""><div class="flex post">
                <i class="fa fa-user-o" aria-hidden="true"></i>
                <h3 id="">${data.userUsername}</h3>
                <h3 id="">ID: ${data.userId}</h3>
                </div></a>`;
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
