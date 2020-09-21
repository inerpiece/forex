const express = require('express');
const Joi = require('joi');
const User = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/authenticate');
const admin = require('../middleware/permit');


const router = express.Router();

// GET requests

router.get('/users', async (req, res) => {
    try {
        const allMembers = await User.readAllMembers();
        res.send(JSON.stringify(allMembers));
    } catch (err) {
        res.status(404).send(JSON.stringify(err));
    }
});

router.get('/user/:userId', async (req, res) => {
    const paramsObject = {
        userId: req.params.userId
    }
    const {error} = User.validate(paramsObject);
    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            const user = await User.readByIdAdmin(req.params.userId);
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
        if (validateUser.error) throw {
            statusCode: 400,
            message: validateUser.error
        };

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

router.put('/user/:userId', [auth, admin], async (req, res) => {
    try {
        //if(!(req.params.userId == req.user.userId)) throw {statusCode: 405, message: 'Cannot update other users'}
        const paramsObject = {
            userId: req.params.userId
        }

        const {error} = User.validate(paramsObject);
        if (error) throw  {statusCode: 400, message: error};

        const validatePayload = User.validate(req.body);
        if (validatePayload.error) throw  {statusCode: 400, message: error};

        const user = await User.readByIdAdmin(req.params.userId);

        //console.log(`user: ${JSON.stringify(user)}`);
        //console.log(`req.body: ${JSON.stringify(req.body)}`);
        const updatedUserWannabe = _.merge(user, req.body);
        //console.log(`updatedUserWannabe: ${JSON.stringify(updatedUserWannabe)}`);

        const updatedUser = await updatedUserWannabe.update();

        res.send(JSON.stringify(updatedUser));
                    
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


});

// DELETE requests

router.delete('/user/:userId', [auth, admin], async (req, res) => {
    try {
        const validateUserId = User.validate(req.params);
        if(validateUserId.error) throw {statusCode: 400, message: validateUserId.error};

        if(req.params.userId == req.user.userId) throw {statusCode: 405, message: 'Cannot delete yourself'}

        const userToBeDeleted = await User.readByIdAdmin(req.params.userId);

        if(userToBeDeleted.role.roleName == 'Admin') throw {statusCode: 405, message: 'Cannot delete other admins'}

        const deletedUser = await userToBeDeleted.delete();

        res.send(JSON.stringify(deletedUser));
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
});

module.exports = router;