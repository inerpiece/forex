const registerFirstName = document.getElementById('registerFirstName');
const registerLastName = document.getElementById('registerLastName');
const registerBirthday = document.getElementById('registerBirthday');
const registerUsername = document.getElementById('registerUsername');
const registerPhone = document.getElementById('registerPhone');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
const registerButton = document.getElementById('registerButton');

const alertBox = document.getElementById('alertBox');

registerButton.addEventListener('click', (e)=>{
    e.preventDefault();

    if (!(registerFirstName.value && registerLastName.value && registerUsername.value && registerEmail.value && registerPassword.value && registerPasswordConfirm.value)){
        alertBox.innerHTML = "Please insert information into the necessary fields";
        setTimeout(function () {
            alertBox.innerHTML = alertBox.innerHTML.replace("Please insert information into the necessary fields", "");  
        }, 2000);
    } else {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                console.log('we are here in the fe')
                alertBox.innerHTML = `Registering successful`;
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                location.href = 'http://127.0.0.1:5500/client/login.html';
            }
            if(this.readyState == 4 && this.status >= 400){
                alertBox.innerHTML = `Registering unsuccessful, error: ${this.status}`;
            }
        };
        xhttp.open('POST', 'http://127.0.0.1:8577/api/members');
        xhttp.setRequestHeader('Content-Type', 'application/json');

        if(registerPassword.value != registerPasswordConfirm.value) throw (alertBox.innerHTML = 'Password must match');

        const payload = {
            userEmail: registerEmail.value,
            userFirstName: registerFirstName.value,
            userLastName: registerLastName.value,
            userUsername: registerUsername.value,
            userPhone: parseInt(registerPhone.value),
            userBirthDay: registerBirthday.value,
            password: registerPassword.value,
        }
        xhttp.send(JSON.stringify(payload));
    }
});