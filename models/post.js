const con = require('../config/connection');
const Joi = require('joi');
const sql = require('mssql');
// const bcrypt = require('bcryptjs');
// const crypt = require('../config/encrypt');
const User = require('./user');


class Post {
    constructor(postObj) {
        this.postId = postObj.postId;
        this.postTitle = postObj.postTitle;
        this.postBody = postObj.postBody;
        this.postDate = postObj.postDate;
        this.user = {};
        this.user.userId = postObj.user.userId;
        this.user.userUsername = postObj.user.userUsername;
        //this.comments = [];
    }

    static validate(postObj) {
        const schema = Joi.object({
            postId: Joi.number().integer().min(1),
            postTitle: Joi.string().max(255),
            postBody: Joi.string(),
            postDate: Joi.string().max(50),
            user: Joi.object({
                userId: Joi.number().integer().min(1),
                userUsername: Joi.string().max(50)
            })
        });
        return schema.validate(postObj);
    }

    // GET (READ) posts
    static readById(postId){
        return new Promise((resolve, reject) => {
            (async ()=>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('postID', sql.Int, postId)
                    .query(`SELECT *
                            FROM forexPost

                            INNER JOIN forexUser
                            ON forexUser.userID = forexPost.FK_userID

                            WHERE forexPost.postID = @postID`);

                    console.log(result);
                    if (!result.recordset[0]) throw {message: 'Post doesnt exist'}

                    const record = {
                        postId: result.recordset[0].postID,
                        postTitle: result.recordset[0].postTitle,
                        postBody: result.recordset[0].postBody,
                        postDate: result.recordset[0].postDate,
                        user: {
                            userUsername: result.recordset[0].userUsername
                        }
                    }

                    const {error} = Post.validate(record);
                    if (error) throw error;

                    resolve(new Post(record));
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    }

    static readAllPosts(){
        return new Promise((resolve, reject) => {
            (async ()=>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .query(`SELECT *
                            FROM forexPost
                            
                            INNER JOIN forexUser
                            ON forexUser.userID = forexPost.FK_userID`);

                    const posts = [];
                    result.recordset.forEach(record => {
                        const postInstance = {
                            postId: record.postID,
                            postTitle: record.postTitle,
                            postBody: record.postBody,
                            postDate: record.postDate,
                            user: {
                                userId: record.userID,
                                userUsername: record.userUsername
                            }
                        }
                        const {error} = Post.validate(postInstance);
                        if (error) throw error;

                        posts.push(new Post(postInstance));
                    });

                    resolve(posts);
                } catch (err) {
                    console.log(err);
                reject(err);
                }
                sql.close();
            })();
        });
    }

    // POST (CREATE) post
    create() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('postTitle', sql.NVarChar(255), this.postTitle)
                        .input('postBody', sql.NVarChar(), this.postBody)
                        .input('postDate', sql.NVarChar(50), this.postDate)
                        .input('FK_userID', sql.Int, this.user.userId)
                        .query(`INSERT INTO forexPost (postTitle, postBody, postDate, FK_userID)
                            VALUES (@postTitle, @postBody, @postDate, @FK_userID)
                            
                            SELECT *
                            FROM forexPost
                            INNER JOIN forexUser
                            ON forexPost.FK_userID = forexUser.userID
                            WHERE postID = SCOPE_IDENTITY();
                            `);

                    console.log(result);

                    if (result.recordset.length != 1) throw {
                        statusCode: 500,
                        message: 'DB is corrupt from user.js'
                    };

                    const record = {
                        postId: result.recordset[0].postID,
                        postTitle: result.recordset[0].postTitle,
                        postBody: result.recordset[0].postBody,
                        postDate: result.recordset[0].postDate,
                        user: {
                            userId: result.recordset[0].userID,
                            userUsername: result.recordset[0].userUsername
                        }
                    }

                    const {
                        error
                    } = Post.validate(record);
                    if (error) throw {
                        statusCode: 409,
                        message: error
                    };

                    resolve(new Post(record));

                } catch (err) {
                    console.log(err);
                    let errorMessage;
                    if (!err.statusCode) {
                        errorMessage = {
                            statusCode: 500,
                            message: err + 'we are here tihi'
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

    update(){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('postID', sql.Int, this.postId)
                    .input('postTitle', sql.NVarChar(255), this.postTitle)
                    .input('postBody', sql.NVarChar(), this.postBody)
                    .query(`UPDATE forexPost
                            SET postTitle = @postTitle,
                            postBody = @postBody
                            WHERE postID = @postID
                            
                            SELECT *
                            FROM forexPost
                            INNER JOIN forexUser
                            ON forexUser.userID = forexPost.FK_userID
                            WHERE postID = @postID`);
                    
                    console.log(result);
                    if (!result.recordset[0]) throw {message: 'Post not found. Not updated.'};

                    const record = {
                        postId: result.recordset[0].postID,
                        postTitle: result.recordset[0].postTitle,
                        postBody: result.recordset[0].postBody,
                        postDate: result.recordset[0].postDate,
                        user: {
                            userId: result.recordset[0].userID,
                            userUsername: result.recordset[0].userUsername
                        }
                    }

                    const {error} = Post.validate(record);
                    if (error) throw error;

                    resolve(new Post(record));

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
                    .input('userID', sql.Int, this.userId)
                    .input('postID', sql.Int, this.postId)
                    .query(`SELECT *
                            FROM forexPost
                            INNER JOIN forexComment
                            ON forexComment.FK_postID = forexPost.postID
                            INNER JOIN forexUser
                            ON forexUser.userID = forexPost.FK_userID
                            WHERE postID = @postID
                            
                            DELETE FROM forexComment
                            WHERE FK_postID = @postID

                            DELETE FROM forexPost
                            WHERE FK_userID = @userID

                            DELETE FROM forexPost
                            WHERE postID = @postID`);


                    console.log(`This is the RESULT after deleteing a post: ${result}`);

                    if(result.recordset.length == 0) throw {statusCode: 404, message: "Post not found"}
                    //if(result.recordset.length > 1) throw {statusCode: 500, message: "Multiple POST IDs: DB is corrupt"}

                    const postWannabe = {
                        postId: result.recordset[0].postID,
                        postTitle: result.recordset[0].postTitle,
                        postBody: result.recordset[0].postBody,
                        postDate: result.recordset[0].postDate,
                        user: {
                            userId: result.recordset[0].userID,
                            userUsername: result.recordset[0].userUsername
                        }
                    }

                    const {error} = Post.validate(postWannabe);
                    if (error) throw error;

                    resolve(new Post(postWannabe));

                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            sql.close()
            })();
        });
    }
}

module.exports = Post;