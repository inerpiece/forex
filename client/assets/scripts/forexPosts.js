const logoutButton = document.getElementById('logoutButton');
const usernameHeader =  document.getElementById('usernameHeader');
const localStorage = window.localStorage;
const currentUser = window.localStorage.getItem('currentUser');
const currentUserObj = JSON.parse(currentUser);
const postsPanel = document.getElementById('postsPanel');

//const loadedWindow = window.onload();


function populateUsername(){
    console.log(currentUser)
    usernameHeader.innerHTML = `<a href="http://127.0.0.1:5500/client/profile.html">${currentUserObj.userUsername}</a>`;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
    localStorage.removeItem('searchedUser');
});

function getPosts(){
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            console.log(data);
            data.forEach(data => {
                console.log(data);
               postsPanel.innerHTML += `
                <a href="http://127.0.0.1:5500/client/post.html?${data.postId}"><div id="${data.postId}" class="post flex">
                <i class="fa fa-user-o fa-2x" aria-hidden="true"></i>
                <h3 id="">${data.postTitle}</h3>
                <h3 id="">${data.user.userUsername}</h3>
                <h3 id="">${data.postDate}</h3>
                <h3>${data.postId}</h3>
                </div></a>`;
            });
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    xhttp.open('GET', 'http://127.0.0.1:8577/api/member/posts');

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
}

window.onload = getPosts;

const newDateYear = new Date().getUTCFullYear();
const newDateMonth = new Date().getUTCMonth() +1;
const newDateDay = new Date().getUTCDate();
const newDate = `${newDateDay}/${newDateMonth}/${newDateYear}`;

const forexPostTitle = document.getElementById('forexPostTitle');
const forexPostBody = document.getElementById('forexPostBody');
const forexPostBtn = document.getElementById('forexPostBtn');


forexPostBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    if(!(forexPostTitle.value && forexPostBody.value)){
        alertBox.innerHTML = "Please insert title and message before posting!";
        setTimeout(function () {
            alertBox.innerHTML = alertBox.innerHTML.replace("Please insert title and message before posting!", "");  
        }, 2000);
    } else {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                console.log('we are here in the fe')
                alertBox.innerHTML = `Posting successful`;
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                location.reload(); // forward to the actual post page
            }
            if(this.readyState == 4 && this.status >= 400){
                alertBox.innerHTML = `Posting unsuccessful, error: ${this.status}`;
            }
        };
        xhttp.open('POST', 'http://127.0.0.1:8577/api/member/posts');
        xhttp.setRequestHeader('Content-Type', 'application/json');

        if (localStorage.getItem('currentUser')){
            const {token} = JSON.parse(localStorage.getItem('currentUser'));
            xhttp.setRequestHeader('x-authentication-token', token);
        }

        const payload = {
            postTitle: forexPostTitle.value,
            postBody: forexPostBody.value,
            postDate: newDate
        }

        xhttp.send(JSON.stringify(payload));
    }
});