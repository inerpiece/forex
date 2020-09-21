const express = require('express');
const Joi = require('joi');
const sql = require('mssql');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const auth = require('../middleware/authenticate');
const router = express.Router();

// GET requests

router.get('/post/:postId', async (req, res) => {
    try {
        const {error} = await Post.validate(req.params)
        if (error) throw {statusCode: 400, message: error}

        const allComments = await Comment.readAllByPostId(req.params.postId)
        
        res.send(JSON.stringify(allComments));
    } catch (err) {
        res.status(404).send(JSON.stringify(err));
    }
});

// POST requests

router.post('/post/:postId', [auth], async (req, res) => {
    const commentWannabe = req.body;
    commentWannabe.user = {};
    commentWannabe.user.userId = req.user.userId;

    // commentWannabe.post = {};
    // commentWannabe.post.postId = req.body.post.postId;

    try {
        const validateComment = await Comment.validate(commentWannabe);
        if (validateComment.error) throw {statusCode: 400, message: validateComment.error};

        const newComment = await new Comment(commentWannabe).create();
        res.send(JSON.stringify(newComment));
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