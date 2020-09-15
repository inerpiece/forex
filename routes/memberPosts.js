const express = require('express');
const Joi = require('joi');
const sql = require('mssql');
const Post = require('../models/post');

const User = require('../models/user');

const router = express.Router();

// GET requests

router.get('/', async (req, res) => {

});

router.get('/post/:postId', async (req, res) => {

});

// POST requests

router.post('/', async (req, res) => {
    const postWannabe = req.body;

    try {
        const validatePost = Post.validate(postWannabe);
        if(validatePost.error) throw {statusCode: 400, message: validatePost.error};

        const newPost = await new Post(postWannabe);
        res.send(JSON.stringify(newPost));
        
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