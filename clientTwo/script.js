const loginName = document.querySelector('#loginName');
const loginPassword = document.querySelector('#loginPassword');
const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');
const secretBtn = document.querySelector('#enterProtectedArea');
const myStorage = window.localStorage;

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    //basic html5 validation for email... a@a.a
    //check if there is input (both email and password)
    //send login request to api
    if (!(loginName.value && loginPassword.value)){
        alert('Enter email and password');
    } else {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                alert(`Login successful: ${xhttp.responseText}`);
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                // render dom elements with the info we got back
                //-e.g 'hello user'
                myStorage.setItem('currentUser', xhttp.responseText);
            }
            if (this.readyState == 4 && this.status >= 400){
                alert(`Login unsuccessful, error: ${this.status}`);
            }

        };
        xhttp.open('POST', 'http://127.0.0.1:8577/api/login');
        xhttp.setRequestHeader('Content-Type', 'application/json');

        const payload = {
            userEmail: loginName.value,
            password: loginPassword.value
        }

        xhttp.send(JSON.stringify(payload));
    }
});

secretBtn.addEventListener('click', (e) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            console.log(data);
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.parse(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...


        }
    };

    xhttp.open('POST', 'http://127.0.0.1:8577/api/member/posts');
    xhttp.setRequestHeader('Content-Type', 'application/json');

    if (myStorage.getItem('currentUser')){
        const {token} = JSON.parse(myStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    const payload = {
        postTitle: "Test ",
        postBody: "body",
        postDate: "today"
    }
    xhttp.send(JSON.stringify(payload));
});

logoutBtn.addEventListener('click', (e) =>{
    myStorage.removeItem('currentUser');
});