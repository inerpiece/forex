const con = require('../config/connection');
const Joi = require('joi');
const sql = require('mssql');
// const bcrypt = require('bcryptjs');
// const crypt = require('../config/encrypt');
const Post = require('./post');
const User = require('./user');

class Comment {
    constructor(commentObj){
        this.commentId = commentObj.commentID,
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

                            WHERE forexComment.commentID = SCOPE_IDENTITY();


                            
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

    delete(){
        
    };

}

module.exports = Comment;