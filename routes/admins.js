const express = require('express');
const Joi = require('joi');
const User = require('../models/user');
const _ = require('lodash');

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

});

// PUT requests

router.put('/user/:userId', async (req, res) => {
    
});

// DELETE requests

router.delete('/user/:userId', async (req, res) => {

});

module.exports = router;