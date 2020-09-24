const express = require('express'); // requiring express so that we can use it
const app = express(); //basic usage of express functionality

const cors = require('cors');

//require middleware
const setJSON = require('./middleware/setResponseHeader');
const auth = require('./middleware/authenticate');
const admin = require('./middleware/permit');
const mod = require('./middleware/permitMod');

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

const login = require('./routes/login');

const roles = require('./routes/roles'); //all roles



//using middleware and others below
app.use(cors());
app.use(express.json()); //renders all req.body in JSON format
app.use(setJSON);


// app.use( (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next()
// })


//using all routes below
app.use('/api/members', members); //put [auth] but not for the entire route, otherwise members cant sign up
app.use('/api/moderators', [auth, mod], moderators);
app.use('/api/admins', [auth, admin], admins);

app.use('/api/member/posts', [auth], memberPosts);
app.use('/api/mod/posts', [auth, mod], moderatorPosts);
app.use('/api/admin/posts', [auth, admin], adminPosts);

app.use('/api/member/comments', [auth], memberComments);
app.use('/api/mod/comments', [auth, mod], moderatorComments);
app.use('/api/admin/comments', [auth, admin], adminComments);

app.use('/api/roles', roles);

app.use('/api/login', login);


const myPort = 8577;
app.listen(myPort, () => console.log(`Listening to port: ${myPort}...`));