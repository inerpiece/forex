const express = require('express'); // requiring express so that we can use it
const app = express(); //basic usage of express functionality

//requiring all routes below
const members = require('./routes/members'); //member
const moderators = require('./routes/moderators'); //mod
const admins = require('./routes/admins'); //admin

const memberPosts = require('./routes/memberPosts'); //member post
const moderatorPosts = require('./routes/moderatorPosts'); //mod post
const adminPosts = require('./routes/adminPosts'); //admin post

const memberComments = require('./routes/memberComments'); //member comment
const moderatorComments = require('./routes/moderatorComments'); //mod comment
const adminComments = require('./routes/adminComments'); //admin comment

const roles = require('./routes/roles'); //all roles



//using middleware and others below
app.use(express.json()); //renders all req.body in JSON format


//using all routes below
app.use('/api/members', members);
app.use('/api/moderators', moderators);
app.use('/api/admins', admins);

app.use('/api/member/posts', memberPosts);
app.use('/api/mod/posts', moderatorPosts);
app.use('/api/admin/posts', adminPosts);

app.use('/api/member/comments', memberComments);
app.use('/api/mod/comments', moderatorComments);
app.use('/api/admin/comments', adminComments);

app.use('/api/roles', roles);


const myPort = 8577;
app.listen(myPort, () => console.log(`Listening to port: ${myPort}...`));