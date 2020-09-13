const express = require('express'); // requiring express so that we can use it
const app = express(); //basic usage of express functionality

app.use(express.json()); //renders all req.body in JSON format

const myPort = 8577;
app.listen(myPort, () => console.log(`Listening to port: ${myPort}...`));