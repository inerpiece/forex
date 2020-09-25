const logoutButton = document.getElementById('logoutButton');
const usernameHeader =  document.getElementById('usernameHeader');
const localStorage = window.localStorage;
const currentUser = window.localStorage.getItem('currentUser');
const currentUserObj = JSON.parse(currentUser);

const postArticle = document.getElementById('postArticle');

const newDateYear = new Date().getUTCFullYear();
const newDateMonth = new Date().getUTCMonth() +1;
const newDateDay = new Date().getUTCDate();
const newDate = `${newDateDay}/${newDateMonth}/${newDateYear}`;

const postPostTitle = document.getElementById('postPostTitle');

const commentSection = document.getElementById('commentSection');
const commentsAmount = document.getElementById('commentsAmount');

const switchPostToUpdate = document.getElementById('switchPostToUpdate');
const switchUpdateToPost = document.getElementById('switchUpdateToPost');
//const postInitialInfo = document.getElementById('postInitialInfo');
const postUpdateInfo = document.getElementById('postUpdateInfo');

//const loadedWindow = window.onload();


function populateUsername(){
    //console.log(currentUser)
    usernameHeader.innerHTML = `<a href="http://127.0.0.1:5500/client/profile.html">${currentUserObj.userUsername}</a>`;
}
populateUsername();

logoutButton.addEventListener('click', (e) =>{
    localStorage.removeItem('currentUser');
    localStorage.removeItem('searchedUser');
});


const idUsernameRole = document.getElementById('idUsernameRole');
const idPostedOn = document.getElementById('idPostedOn');
const idPostId = document.getElementById('idUsernameRole');
const idUsernameRoleUPDATE = document.getElementById('idUsernameRoleUPDATE');
const idPostedOnUPDATE = document.getElementById('idPostedOnUPDATE');
const idPostIdUPDATE = document.getElementById('idUsernameRoleUPDATE');
const idPostBodyId = document.getElementById('idPostBodyId');
const idPostBodyIdUPDATE = document.getElementById('idPostBodyIdUPDATE');
const idPostTitleUPDATE = document.getElementById('idPostTitleUPDATE');

const deletePostBtn = document.getElementById('deletePostBtn');
const updatePostBtn = document.getElementById('updatePostBtn');

const staticArticle16 = document.getElementById('staticArticle16');
const updateArticle16 = document.getElementById('updateArticle16');
const static16 = document.getElementById('static16');
const update16 = document.getElementById('update16');

const commentUserNameStatic = document.getElementById('commentUserNameStatic');
const commentDateStatic = document.getElementById('commentDateStatic');
const commentIDStatic = document.getElementById('commentIDStatic');
const commentBodyStatic = document.getElementById('commentBodyStatic');

const hrefUrl = location.href.split('?')[1];
//console.log(location.href.split('?')[1]);


function getPostAndComments(){
    const xhttpPost = new XMLHttpRequest();

    xhttpPost.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            //console.log(JSON.stringify(data));
            idUsernameRole.innerHTML = `${data.user.userUsername}`;
            idPostedOn.innerHTML = `${data.postDate}`;
            idPostId.innerHTML = `${data.postId}`;
            idPostBodyId.innerHTML = `${data.postBody}`;

            idUsernameRoleUPDATE.innerHTML = `${data.user.userUsername}`;
            idPostedOnUPDATE.innerHTML = `${data.postDate}`;
            idPostIdUPDATE.innerHTML = `${data.postId}`;
            idPostBodyIdUPDATE.innerHTML = `${data.postBody}`;
            idPostTitleUPDATE.value = `${data.postTitle}`;

            postPostTitle.innerHTML = `${data.postTitle}`;
            // can do any kind of DOM or other manipulation here with the data
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    }

    xhttpPost.open('GET', `http://127.0.0.1:8577/api/member/posts/post/${hrefUrl}`)

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttpPost.setRequestHeader('x-authentication-token', token);
    }

    xhttpPost.send()

    const xhttpComment = new XMLHttpRequest();

    xhttpComment.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            //console.log(JSON.stringify(data));
            commentsAmount.innerHTML = `(${data.length})`;
            // can do any kind of DOM or other manipulation here with the data
            data.forEach(data => {
                
            //console.log(data.length);

            // commentUserNameStatic.innerHTML = `${data.user.userUsername}`;
            // commentDateStatic.innerHTML = `${data.commentDate}`;
            // commentIDStatic.innerHTML = `${data.commentId}`;
            // commentBodyStatic.innerHTML = `${data.commentBody}`;
            
            commentSection.innerHTML += `
            <article class="comment normalUserComment" id="staticArticle16">
                <div class="post flex ">
                    <i class="fa fa-user-o fa-2x" aria-hidden="true"></i>
                    <h3 class="" id="">${data.user.userUsername}</h3>
                    <h3 class="" id="">${data.commentDate}</h3>
                    <h3 class="" id="">ID: ${data.commentId}</h3>
                    <i class="fa fa-pencil-square-o fa-2x" aria-hidden="true" id="static16"></i>
                </div>
                <div class="commentBody">
                    <p class="" id="">${data.commentBody}</p>
                </div>
            </article>
            <article class="comment hidden adminUserComment" id="updateArticle16"> 
                <div class="post flex ">
                    <i class="fa fa-user-o fa-2x" aria-hidden="true"></i>
                    <h3 class="" id="">${data.user.userUsername}</h3>
                    <h3 class="" id="">${data.commentDate}</h3>
                    <h3 class="" id="">ID: ${data.commentId}</h3>
                    <i class="fa fa-pencil-square-o fa-2x" aria-hidden="true" id="update16"></i>
                </div>
                <div class="commentBody"> 
                    <form action="" class="flex column">
                        <textarea name="" id="" cols="30" rows="10">Comment body</textarea>
                        <div class="flex fxBetween">
                            <div class="btn delete" id="">Delete</div>
                            <div class="btn update" id="">Update</div>
                        </div>
                    </form>
                </div>
            </article>`;

            

            });
            
            
        }
        if (this.readyState == 4 && this.status >= 400){
            const errorData = JSON.stringify(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
        }
    };

    xhttpComment.open('GET', `http://127.0.0.1:8577/api/member/comments/post/${hrefUrl}`)

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttpComment.setRequestHeader('x-authentication-token', token);
    }

    xhttpComment.send()
};

window.onload = getPostAndComments;


const forexCommentBody = document.getElementById('forexCommentBody');
const forexCommentBtn = document.getElementById('forexCommentBtn');

forexCommentBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if (!forexCommentBody.value){
        alertBox.innerHTML = "Please message before commenting!";
        setTimeout(function () {
            alertBox.innerHTML = alertBox.innerHTML.replace("Please message before commenting!", "");  
        }, 2000);
    } else {
        
        const xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function(){
            
            if (this.readyState == 4 && this.status == 200){
                console.log('we are here in the fe')
                alertBox.innerHTML = `Commenting successful`;
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                location.reload(); // forward to the actual post page
            }
            if(this.readyState == 4 && this.status >= 400){
                alertBox.innerHTML = `Commenting unsuccessful, error: ${this.status}`;
            }
        };

        xhttp.open('POST', `http://127.0.0.1:8577/api/member/comments/post/${hrefUrl}`);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        if (localStorage.getItem('currentUser')){
            const {token} = JSON.parse(localStorage.getItem('currentUser'));
            xhttp.setRequestHeader('x-authentication-token', token);
        }

        const payload = {
            commentBody: forexCommentBody.value,
            commentDate: newDate
        }

        console.log(payload);

        xhttp.send(JSON.stringify(payload));
    }
})


switchPostToUpdate.addEventListener('click', ()=>{
    console.log("I clicked" + switchUpdateToPost);
    if(postArticle.classList.contains('hidden')){
        postArticle.classList.remove('hidden');
        postUpdateInfo.classList.add('hidden');
    } else {
        postArticle.classList.add('hidden');
        postUpdateInfo.classList.remove('hidden');
    }
});



switchUpdateToPost.addEventListener('click', ()=>{
    console.log("I clicked" + switchUpdateToPost);
    if(postUpdateInfo.classList.contains('hidden')){
        postArticle.classList.add('hidden');
        postUpdateInfo.classList.remove('hidden');
    } else {
        postArticle.classList.remove('hidden');
        postUpdateInfo.classList.add('hidden');
    }
});


updatePostBtn.addEventListener('click', (e)=>{
    e.preventDefault()

    

    if(!(idPostTitleUPDATE.value && idPostBodyIdUPDATE.value)){
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

        xhttp.open('PUT', `http://127.0.0.1:8577/api/mod/posts/post/${hrefUrl}`);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        if (localStorage.getItem('currentUser')){
            const {token} = JSON.parse(localStorage.getItem('currentUser'));
            xhttp.setRequestHeader('x-authentication-token', token);
        }

        const payload = {
            postTitle: idPostTitleUPDATE.value,
            postBody: idPostBodyIdUPDATE.value,
            postDate: newDate
        }

        xhttp.send(JSON.stringify(payload));
    }
});

deletePostBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            console.log('we are here in the fe')
            console.log(this.readyState);
            location.href = 'http://127.0.0.1:5500/client/posts.html';
             // forward to the actual post page
        }
        if(this.readyState == 4 && this.status >= 400){
            alertBox.innerHTML = `Posting unsuccessful, error: ${this.status}`;
            location.href = 'http://127.0.0.1:5500/client/posts.html';
        }
    };

    

    xhttp.open('DELETE', `http://127.0.0.1:8577/api/admin/posts/post/${hrefUrl}`);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    if (localStorage.getItem('currentUser')){
        const {token} = JSON.parse(localStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }

    xhttp.send();
    
});



// static16.addEventListener('click', (e)=>{
//     if(staticArticle16.classList.contains('hidden')){
//         staticArticle16.classList.remove('hidden');
//         updateArticle16.classList.add('hidden');
//     } else {
//         staticArticle16.classList.add('hidden');
//         updateArticle16.classList.remove('hidden');
//     }
// });

// function renderOnClicks(){
//     if(staticArticle16.classList.contains('hidden')){
//         staticArticle16.classList.remove('hidden');
//         updateArticle16.classList.add('hidden');
//     } else {
//         staticArticle16.classList.add('hidden');
//         updateArticle16.classList.remove('hidden');
//     }
// }
