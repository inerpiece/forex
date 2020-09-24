const localStorage = window.localStorage;
const loginEmail = document.querySelector('#loginEmail');
const loginPW = document.querySelector('#loginPW');
const loginButton = document.querySelector('#loginButton');
const alertBox = document.querySelector('#alertBox');

loginButton.addEventListener('click', (e) =>{
    e.preventDefault();

    
    if(!(loginEmail.value && loginPW.value)){
        alertBox.innerHTML = "Enter email and password"
        setTimeout(function () {
            alertBox.innerHTML = alertBox.innerHTML.replace("Enter email and password", "");  
        }, 2000);
    } else {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                alertBox.innerHTML = `Login Successful`;
                const data = JSON.parse(xhttp.responseText);
                console.log(data);

                localStorage.setItem('currentUser', xhttp.responseText);
                location.href = 'http://127.0.0.1:5500/client/posts.html';
            }
            if (this.readyState == 4 && this.status >= 400){
                alertBox.innerHTML = `Login unsuccessful, error: ${this.status}`;
            }
        };
        xhttp.open('POST', 'http://127.0.0.1:8577/api/login');
        xhttp.setRequestHeader('Content-Type', 'application/json');

        const payload = {
            userEmail: loginEmail.value,
            password: loginPW.value
        }

        if (localStorage.getItem('currentUser')){
            const {token} = JSON.parse(localStorage.getItem('currentUser'));
            xhttp.setRequestHeader('x-authentication-token', token);
        }

        xhttp.send(JSON.stringify(payload));
        

        // xhttp.onreadystatechange = function(){
        //     if (this.readyState == 4 && this.status == 200) {
        //         const data = JSON.parse(this.responseText);
        //         console.log(data);
        //         location.href = 'http://127.0.0.1:5500/client/posts.html';
        //     }
        //     if (this.readyState == 4 && this.status >= 400){
        //         //console.log(typeof(this.responseText));
        //         const errorData = JSON.stringify(this.responseText);
        //         console.log(errorData);
                
        //         alertBox.innerHTML = "Username or password doesn't match";
        //     }
        // };
        
        // xhttp.open('GET', `http://127.0.0.1:8577/api/members/user/2`);

        

        // xhttp.send();
        
    }
});




