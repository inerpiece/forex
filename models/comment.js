const con = require('../config/connection');
const Joi = require('joi');
const sql = require('mssql');
// const bcrypt = require('bcryptjs');
// const crypt = require('../config/encrypt');
const Post = require('./post');
const User = require('./user');

class Comment {
    constructor(commentObj){
        this.commentId = commentObj.commentId,
        this.commentBody = commentObj.commentBody,
        this.commentDate = commentObj.commentDate,

        this.user = {};
        this.user.userId = commentObj.user.userId;
        this.user.userUsername = commentObj.user.userUsername;

        this.post = {};
        this.post.postId = commentObj.post.postId;

    }

    static validate(commentObj) {
        const schema = Joi.object({
            commentId: Joi.number().integer().min(1),
            commentBody: Joi.string(),
            commentDate: Joi.string().max(50),
            user: Joi.object({
                userId: Joi.number().integer().min(1),
                userUsername: Joi.string().max(50)
            }),
            post: Joi.object({
                postId: Joi.number().integer().min(1)
            })
        });
        return schema.validate(commentObj);
    }

    static readAllByPostId(postId){
        return new Promise((resolve, reject) => {
            (async ()=>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('postID', sql.Int, postId)
                    .query(`SELECT *
                            FROM forexComment
                            
                            INNER JOIN forexUser
                            ON forexUser.userID = forexComment.FK_userID

                            WHERE forexComment.FK_postID = @postID
                            `);
                    
                            console.log(result);
                    const comments = [];
                    result.recordset.forEach(record => {
                        const commentInstance = {
                            commentId: record.commentID,
                            commentBody: record.commentBody,
                            commentDate: record.commentDate,
                            user: {
                                userId: record.userID,
                                userUsername: record.userUsername
                            },
                            post: {
                                postId: record.FK_postID
                            }
                        }
                        const {error} = Comment.validate(commentInstance);
                        if (error) throw error;

                        comments.push(new Comment(commentInstance));
                    });
                    
                    
                    resolve(comments);
                    
                } catch (err) {
                    console.log(err);
                reject(err);
                }
                sql.close();
            })();
        });
    }

    create() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('commentBody', sql.NVarChar(), this.commentBody)
                        .input('commentDate', sql.NVarChar(50), this.commentDate)
                        .input('FK_userID', sql.Int, this.user.userId)
                        .input('FK_postID', sql.Int, this.post.postId)
                        .query(`INSERT INTO forexComment (commentBody, commentDate, FK_userID, FK_postID)
                            VALUES (@commentBody, @commentDate, @FK_userID, @FK_postID)
                            
                            SELECT *
                            FROM forexComment

                            INNER JOIN forexUser
                            ON forexComment.FK_userID = forexUser.userID

                            INNER JOIN forexPost
                            ON forexComment.FK_postID = forexPost.postID

                            WHERE commentID = SCOPE_IDENTITY();


                            
                            `);

                            /*
                            
                            INNER JOIN forexUser
                            ON forexComment.FK_userID = forexUser.userID
                            
                            WHERE FK_postID = SCOPE_IDENTITY();
                            
                            */

                    console.log(result);

                    const comments = [];
                    result.recordset.forEach(record => {
                        const commentInstance = {
                            commentId: record.commentID,
                            commentBody: record.commentBody,
                            commentDate: record.commentDate,
                            user: {
                                userId: record.userID,
                                userUsername: record.userUsername
                            },
                            post: {
                                postId: record.FK_postID
                            }
                        }
                        const {error} = Comment.validate(commentInstance);
                        if (error) throw error;

                        comments.push(new Comment(commentInstance));
                    });

                    resolve(comments);

                } catch (err) {
                    console.log(err);
                    let errorMessage;
                    if (!err.statusCode) {
                        errorMessage = {
                            statusCode: 500,
                            message: err + 'we are here COMMENT JS'
                        }
                    } else {
                        errorMessage = err;
                    }
                    reject(errorMessage);
                }
                sql.close();
            })();

        })
    }

    static readById(commentId){
        return new Promise((resolve, reject) =>{
            (async () =>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('commentID', sql.Int, commentId)
                    .query(`SELECT *
                            FROM forexComment
                            
                            INNER JOIN forexUser
                            ON forexUser.userID = forexComment.FK_userID

                            INNER JOIN forexPost
                            ON forexPost.postID = forexComment.FK_postID

                            WHERE forexComment.commentID = @commentID`);

                    console.log(result);
                    if (!result.recordset[0]) throw {message: 'Comment doesnt exist'}

                    const record = {
                        commentId: result.recordset[0].commentID,
                        commentBody: result.recordset[0].commentBody,
                        commentDate: result.recordset[0].commentDate,
                        user: {
                            userId: result.recordset[0].userID,
                            userUsername: result.recordset[0].userUsername
                        },
                        post: {
                            postId: result.recordset[0].FK_postID
                        }
                    }
                    const {error} = Comment.validate(record);
                    if (error) throw error;

                    resolve(new Comment(record));
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            sql.close()
            })();
        });
    }


    update(){
        return new Promise((resolve, reject) => {
            (async ()=>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('commentID', sql.Int, this.commentId)
                    .input('commentBody', sql.NVarChar(), this.commentBody)
                    .query(`UPDATE forexComment
                            SET commentBody = @commentBody
                            WHERE commentID = @commentID
                            
                            SELECT *
                            FROM forexComment
                            INNER JOIN forexUser
                            ON forexUser.userID = forexComment.FK_userID
                            INNER JOIN forexPost
                            ON forexPost.postID = forexComment.FK_postID
                            WHERE commentID = @commentID`);

                    console.log(result);
                    if (!result.recordset[0]) throw {message: 'Comment not found. Not updated.'};

                    const record = {
                        commentId: result.recordset[0].commentID,
                        commentBody: result.recordset[0].commentBody,
                        commentDate: result.recordset[0].commentDate,
                        user: {
                            userId: result.recordset[0].userID,
                            userUsername: result.recordset[0].userUsername
                        },
                        post: {
                            postId: result.recordset[0].FK_postID
                        }
                    }

                    const {error} = Comment.validate(record);
                    if (error) throw error;

                    resolve(new Comment(record));
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            sql.close()
            })();
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            (async () =>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('commentID', sql.Int, this.commentId)
                    .input('userID', sql.Int, this.userId)
                    .input('postID', sql.Int, this.postId)
                    .query(`SELECT *
                            FROM forexComment
                            INNER JOIN forexUser
                            ON forexUser.userID = forexComment.FK_userID
                            INNER JOIN forexPost
                            ON forexPost.postID = forexComment.FK_postID
                            WHERE commentID = @commentID 
                            
                            DELETE FROM forexComment
                            WHERE FK_userID = @userID
                            
                            DELETE FROM forexComment
                            WHERE FK_postID = @postID
                            
                            DELETE FROM forexComment
                            WHERE commentID = @commentID`);

                    console.log(result);

                    if(result.recordset.length == 0) throw {statusCode: 404, message: "Comment not found"}
                    if(result.recordset.length > 1) throw {statusCode: 500, message: "Multiple comment IDs: DB is corrupt"}

                    const commentWannabe = {
                        commentId: result.recordset[0].commentID,
                        commentBody: result.recordset[0].commentBody,
                        commentDate: result.recordset[0].commentDate,
                        user: {
                            userId: result.recordset[0].userID,
                            userUsername: result.recordset[0].userUsername
                        },
                        post: {
                            postId: result.recordset[0].FK_postID
                        }
                    }

                    const {error} = Comment.validate(commentWannabe);
                    if (error) throw error;

                    resolve(new Comment(commentWannabe));
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            sql.close()
            })();
        });
    }
}

module.exports = Comment;