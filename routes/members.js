const express = require('express');
const User = require('../models/user');
const _ = require('lodash');

const router = express.Router();

// GET requests

router.get('/:userId', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify({welcome: 'you'}));// tested to see if the route works (localhost:8577/api/members/userId) this works in postman
});

// POST requests

router.post('/', async (req, res) => {
    const userWannabe = _.omit(req.body, 'password');
    const passwordWannabe = _.pick(req.body, 'password');

    try {
        const validateUser = User.validate(userWannabe);
        if(validateUser.error) throw {statusCode: 400, message: validateUser.error};

        const validatePassword = User.validateLoginInfoFormat(passwordWannabe);
        if (validatePassword.error) throw {
            statusCode: 400,
            message: validatePassword.error
        };

        const existingUser = await User.readUserByEmail(userWannabe.userEmail);
        throw {
            statusCode: 403,
            message: 'Cannot save User in DB.'
        };
    } catch (userCheckError) {
        try {
            if (userCheckError.statusCode != 404) throw userCheckError;
            //save the user in the DB via the User.create(passwordObject)
            const newUser = await new User(userWannabe).create(passwordWannabe);
            //if all good, we send the new user back with res
            res.send(JSON.stringify(newUser));
        } catch (err) {
            let errorMessage;
            if (!err.statusCode) {
                errorMessage = {
                    statusCode: 500,
                    message: `This is an error: ${err}`
                };
            } else {
                errorMessage = err;
            }
            res.status(errorMessage.statusCode).send(JSON.stringify(errorMessage));
        }
    }
});

// PUT requests

router.put('/:userId', async (req, res) => {

});

module.exports = router;