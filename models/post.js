const con = require('../config/connection');
const Joi = require('joi');
const sql = require('mssql');
// const bcrypt = require('bcryptjs');
// const crypt = require('../config/encrypt');
const User = require('./user');

class Post {
    constructor(postObj) {
        this.postTitle = postObj.postTitle;
        this.postBody = postObj.postBody;
        this.postDate = postObj.postDate;
        // user: {
        //     this.userId = userObj.userId;
        //     this.userEmail = userObj.userEmail;
        //     this.userFirstName = userObj.userFirstName;
        //     this.userLastName = userObj.userLastName;
        //     this.userUsername = userObj.userUsername;
        //     this.userPhone = userObj.userPhone;
        //     this.userBirthDay = userObj.userBirthDay;
        //     if (userObj.role) {
        //         this.role = {};
        //         this.role.Id = userObj.role.roleId;
        //         this.role.roleName = userObj.role.roleName;
        //         this.role.roleDescription = userObj.role.roleDescription;
        //     }
        // }
    }

    static validate(postObj) {
        const schema = Joi.object({
            postTitle: Joi.string().max(255),
            postBody: Joi.string(),
            postDate: Joi.string().max(50)
            // user: Joi.object({
            //     userId: Joi.number().integer().min(1),
            //     userEmail: Joi.string().email().max(255),
            //     userFirstName: Joi.string().max(50),
            //     userLastName: Joi.string().max(50),
            //     userUsername: Joi.string().max(50),
            //     userPhone: Joi.number().integer(),
            //     userBirthDay: Joi.string().max(50),
            //     role: Joi.object({
            //         roleId: Joi.number().integer().min(1),
            //         roleName: Joi.string().max(50),
            //         roleDescription: Joi.string().max(255),
            //     })
            // })
        });
        return schema.validate(postObj);
    }

    // POST (CREATE) post
    create(postTextObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('postTitle', sql.NVarChar(255), this.postTitle)
                        .input('postBody', sql.NVarChar(), this.postBody)
                        .input('postDate', sql.NVarChar(50), this.postDate)
                        .query(`INSERT INTO forexPost (postTitle, postBody, postDate)
                            VALUES (@postTitle, @postBody, @postDate)
                            
                            SELECT *
                            FROM forexPost
                            WHERE forexPost.postID = SCOPE_IDENTITY();
                            
                            INSERT INTO forexPost (FK_userID)
                            VALUES (SCOPE_IDENTITY())`);

                    console.log(result);

                    if (result.recordset.length != 1) throw { statusCode: 500, message: 'DB is corrupt from user.js' };

                    const record = {
                        postTitle: result.recordset[0].postTitle,
                        postBody: result.recordset[0].postBody,
                        postDate: result.recordset[0].postDate
                        // user: {
                        //     userId: result.recordset[0].userID,
                        //     userEmail: result.recordset[0].userEmail,
                        //     userFirstName: result.recordset[0].userFirstName,
                        //     userLastName: result.recordset[0].userLastName,
                        //     userUsername: result.recordset[0].userUsername,
                        //     userPhone: result.recordset[0].userPhone,
                        //     userBirthDay: result.recordset[0].userBirthDay,
                        //     role: {
                        //         roleId: result.recordset[0].roleID,
                        //         roleName: result.recordset[0].roleName,
                        //         roleDescription: result.recordset[0].roleDescription,
                        //     }
                        // }
                    }

                    const { error } = Post.validate(record);
                    if (error) throw { statusCode: 409, message: error };

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
}

module.exports = Post;