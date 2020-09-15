const express = require('express');
const User = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/authenticate');

const router = express.Router();

// GET requests

router.get('/user/:userId', async (req, res) => { //we need [auth, memeber] so that the user is logged in and at least a member
    const paramsObject = {
        userId: req.params.userId
    }
    const {error} = User.validate(paramsObject);
    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            const user = await User.readById(req.params.userId);
            res.send(JSON.stringify(user));
        } catch (err) {
            res.status(404).send(JSON.stringify(err));
        }
    }
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

router.put('/user/:userId', async (req, res) => {
    
    const paramsObject = {
        userId: req.params.userId
    }

    const {error} = User.validate(paramsObject);
    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            console.log(req.body);
            
            const member = await User.update(req.body);
            res.send(JSON.stringify(member));
        } catch (err) {
            res.status(418).send(JSON.stringify(error));
        }
    }
    
});

module.exports = router;