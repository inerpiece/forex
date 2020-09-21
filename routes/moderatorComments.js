const express = require('express');
const Joi = require('joi');
const sql = require('mssql');
const Post = require('../models/post');
const _ = require('lodash');
const Comment = require('../models/comment');
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

router.get('/comment/:commentId', async (req, res) => {
    const paramsObject = {
        commentId: req.params.commentId
    }
    const {error} = Comment.validate(paramsObject);
    if (error){
        res.status(400).send(JSON.stringify(error));
    } else {
        try {
            const comment = await Comment.readById(req.params.commentId);
            res.send(JSON.stringify(comment));
        } catch (err) {
            res.status(404).send(JSON.stringify(err));
        }
    }
});

// POST requests

router.post('/post/:postId', async (req, res) => {
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

// PUT requests

router.put('/comment/:commentId', async (req, res) =>{
    try {
        console.log(req.user)
        if (req.user.role.Id > 2) throw {statusCode: 405, message: 'Cannot update'}

        const paramsObject = {
            commentId: req.params.commentId
        }

        const {error} = Comment.validate(paramsObject);
        if (error) throw {statusCode: 400, message: error};

        const validatePayload = Comment.validate(req.body);
        if (validatePayload.error) throw {statusCode: 400, message: error};

        const comment = await Comment.readById(req.params.commentId);

        const updatedCommentWannabe = _.merge(comment, req.body);

        const updatedComment = await updatedCommentWannabe.update();

        res.send(JSON.stringify(updatedComment));
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