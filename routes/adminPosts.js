const express = require('express');
const Joi = require('joi');
const sql = require('mssql');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const auth = require('../middleware/authenticate');
const _ = require('lodash');

const router = express.Router();

// GET requests

router.get('/', async (req, res) => {
    try {
        const allPosts = await Post.readAllPosts();
        res.send(JSON.stringify(allPosts));
    } catch (err) {
        res.status(404).send(JSON.stringify(err));
    }
});

router.get('/post/:postId', async (req, res) => {
    const paramsObject = {
        postId: req.params.postId
    }
    const {error} = Post.validate(paramsObject);

    if (error) {
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            const post = await Post.readById(req.params.postId);
            res.send(JSON.stringify(post));
        } catch (err) {
            res.status(404).send(JSON.stringify(err));
        }
    }
});

// POST requests

router.post('/', async (req, res) => {
    const postWannabe = req.body;
    console.log(req.body);
    postWannabe.user = {};
    postWannabe.user.userId = req.user.userId;
    //for testing purpoises only!!! userId = 2
    //postWannabe.user.userId = 2;

    try {
        const validatePost = await Post.validate(postWannabe);
        if(validatePost.error) throw {statusCode: 400, message: validatePost.error};

        const newPost = await new Post(postWannabe).create(postWannabe);
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

// PUT requests

router.put('/post/:postId', [auth], async (req, res) => {
    
    try {
        const paramsObject = {
            postId: req.params.postId
        }
        //console.log(paramsObject)
        const {error} = Post.validate(paramsObject);
        if (error) throw {statusCode: 400, message: error};
        const validatePayload = Post.validate(req.body);
        if (validatePayload.error) throw {statusCode: 400, message: error};

        const post = await Post.readById(req.params.postId);

        const updatedPostWannabe = _.merge(post, req.body);

        const updatedPost = await updatedPostWannabe.update();

        res.send(JSON.stringify(updatedPost));
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

router.delete('/post/:postId', [auth], async (req, res) =>{
    try {
        const validatePostId = Post.validate(req.params);
        if (validatePostId.error) throw {statusCode: 400, message: validatePostId.error};

        const postToBeDeleted = await Post.readById(req.params.postId);
        const deletedPost = await postToBeDeleted.delete();

        res.send(JSON.stringify(deletedPost));
    } catch (err) {
        let errorMessage;
        if (!err.statusCode) {
            errorMessage = {
                statusCode: 500,
                message: `Post doesn't exist + ${err}`
            };
        } else {
            errorMessage = err;
        }
        res.status(errorMessage.statusCode).send(JSON.stringify(errorMessage));
    }
});

module.exports = router;