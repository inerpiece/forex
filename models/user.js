const con = require('../config/connection');
const Joi = require('joi');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const crypt = require('../config/encrypt');

class User {

    constructor(userObj) {
        this.userId = userObj.userId;
        this.userEmail = userObj.userEmail;
        this.userFirstName = userObj.userFirstName;
        this.userLastName = userObj.userLastName;
        this.userUsername = userObj.userUsername;
        this.userPhone = userObj.userPhone;
        this.userBirthDay = userObj.userBirthDay;
        if (userObj.role){
            this.role = {};
            this.role.Id = userObj.role.roleId;
            this.role.roleName = userObj.role.roleName;
            this.role.roleDescription = userObj.role.roleDescription;
        }
    }

    static validate(userObj) {
        const schema = Joi.object({
            userId: Joi.number().integer().min(1),
            userEmail: Joi.string().email().max(255),
            userFirstName: Joi.string().max(50),
            userLastName: Joi.string().max(50),
            userUsername: Joi.string().max(50),
            userPhone: Joi.number().integer(),
            userBirthDay: Joi.string().max(50),
            role: Joi.object({
                roleId: Joi.number().integer().min(1),
                roleName: Joi.string().max(50),
                roleDescription: Joi.string().max(255),
            })
        });

        return schema.validate(userObj);
    }

    static validateLoginInfoFormat(loginInfoObj){
        const schema = Joi.object({
            userEmail: Joi.string().email().max(255),
            password: Joi.string().max(255),
        })
        return schema.validate(loginInfoObj)
    }

    static matchLoginInfo(loginInfoObj){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('userEmail', sql.NVarChar(255), loginInfoObj.userEmail)
                    .query(`SELECT *
                            FROM forexUser

                            INNER JOIN forexPassword
                            ON forexUser.userID = forexPassword.FK_userID

                            INNER JOIN forexUserRole
                            ON forexUser.userID = forexUserRole.FK_userID

                            INNER JOIN forexRole
                            ON forexUserRole.FK_roleID = forexRole.roleID

                            WHERE forexUser.userEmail = @userEmail`);
                    console.log(result);

                    if (!result.recordset[0]) throw {statusCode: 404, message: 'User not found'}
                    if (result.recordset[0].length > 1) throw {statusCode: 500, message: 'DB is corrupt'}

                    const match = await bcrypt.compare(loginInfoObj.password, result.recordset[0].hashPassword);
                    
                    if (!match) throw {statusCode: 404, message: 'User not found'};
                    
                    const record = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName,
                        userLastName: result.recordset[0].userLastName,
                        userUsername: result.recordset[0].userUsername,
                        userPhone: result.recordset[0].userPhone,
                        userBirthDay: result.recordset[0].userBirthDay,
                        role: {
                            roleId: result.recordset[0].roleID,
                            roleName: result.recordset[0].roleName,
                            roleDescription: result.recordset[0].roleDescription,
                        }
                    }

                    const { error } = User.validate(record);
                    
                    if (error) throw {statusCode: 409, message: error};

                    resolve(new User(record));
                    

                } catch (err) {
                    console.log(err);
                    let errorMessage;
                    if(!err.statusCode){
                        errorMessage = {
                            statusCode: 500,
                            message: err
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

    static readUserByEmail(email){
        return new Promise((resolve, reject) => {
            (async () =>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('userEmail', sql.NVarChar(255), email)
                    .query(`SELECT *
                            FROM forexUser
                            WHERE userEmail = @userEmail`);
                    console.log(result.recordset + "This is the length we are looking at");
                    if (result.recordset.length == 0) throw {statusCode: 404, message: "User not found"}
                    if (result.recordset.length > 1) throw {statusCode: 500, message: "DB is corrupt"}
                    
                    const userWannabe = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                    }

                    const {error} = User.validate(userWannabe);
                    if (error) throw {statusCode: 409, message: error};

                    resolve(new User(userWannabe))


                } catch (err) {
                    console.log(err);
                    let errorMessage;
                    if(!err.statusCode){
                        errorMessage = {
                            statusCode: 500,
                            message: `w r h ${err}`
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
    // GET (READ) stuff
    // static readById(userID){
    //     return new Promise((resolve,reject) =>{
    //         (async ()=>{
    //             try {
    //                 const pool = await sql.connect(con);
    //                 const result = await pool.request()
    //                 .input('userID', sql.Int, userID)
    //                 .query(`SELECT *
    //                         FROM forexUser

    //                         INNER JOIN forexUserRole
    //                         ON forexUser.userID = forexUserRole.FK_userID

    //                         INNER JOIN forexRole
    //                         ON forexUserRole.FK_roleID = forexRole.roleID

    //                         WHERE forexUser.userID = @userID`);
                    
    //                 console.log(result);
    //                 if (!result.recordset[0]) throw {message: 'User doesnt exist'}

    //                 const record = {
    //                     //userId: result.recordset[0].userID,
    //                     //userEmail: result.recordset[0].userEmail,
    //                     userFirstName: result.recordset[0].userFirstName,
    //                     //userLastName: result.recordset[0].userLastName,
    //                     userUsername: result.recordset[0].userUsername,
    //                     //userPhone: result.recordset[0].userPhone,
    //                     userBirthDay: result.recordset[0].userBirthDay,
    //                     role: {
    //                         //roleId: result.recordset[0].roleID,
    //                         roleName: result.recordset[0].roleName,
    //                         //roleDescription: result.recordset[0].roleDescription,
    //                     }
    //                 }

    //                 const {error} = User.validate(record);
    //                 if (error) throw error;

    //                 resolve(new User(record));

    //             } catch (err) {
    //                 console.log(err);
    //                     reject(err);
    //             }
    //             sql.close();
    //         })();
    //     })
    // }

    static readById(userID){
        return new Promise((resolve,reject) =>{
            (async ()=>{
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('userID', sql.Int, userID)
                    .query(`SELECT *
                            FROM forexUser

                            INNER JOIN forexUserRole
                            ON forexUser.userID = forexUserRole.FK_userID

                            INNER JOIN forexRole
                            ON forexUserRole.FK_roleID = forexRole.roleID

                            WHERE forexUser.userID = @userID`);
                    
                    console.log(result);
                    if (!result.recordset[0]) throw {message: 'User doesnt exist'}

                    const record = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName,
                        userLastName: result.recordset[0].userLastName,
                        userUsername: result.recordset[0].userUsername,
                        userPhone: result.recordset[0].userPhone,
                        userBirthDay: result.recordset[0].userBirthDay,
                        role: {
                            roleId: result.recordset[0].roleID,
                            roleName: result.recordset[0].roleName,
                            roleDescription: result.recordset[0].roleDescription,
                        }
                    }

                    const {error} = User.validate(record);
                    if (error) throw error;

                    resolve(new User(record));

                } catch (err) {
                    console.log(err);
                        reject(err);
                }
                sql.close();
            })();
        })
    }

    static readAllMembers(){
        return new Promise((resolve, reject) =>{
        (async ()=>{
            try {
                const pool = await sql.connect(con);
                const result = await pool.request()
                .query(`SELECT *
                        FROM forexUser

                        INNER JOIN forexUserRole
                        ON forexUser.userID = forexUserRole.FK_userID

                        INNER JOIN forexRole
                        ON forexUserRole.FK_roleID = forexRole.roleID`);

                const members = [];
                result.recordset.forEach(record => {
                    const memberInstance = {
                        userId: record.userID,
                        userEmail: record.userEmail,
                        userFirstName: record.userFirstName,
                        userLastName: record.userLastName,
                        userUsername: record.userUsername,
                        userPhone: record.userPhone,
                        userBirthDay: record.userBirthDay,
                        role: {
                            roleId: record.roleID,
                            roleName: record.roleName,
                            roleDescription: record.roleDescription,
                        }
                    }
                    const {error} = User.validate(memberInstance);
                    if (error) throw error;

                    members.push(new User(memberInstance));
                });
                resolve(members);
            } catch (err) {
                console.log(err);
                reject(err);
            }
            sql.close();
        })();
        });
    }

    // POST (CREATE) stuff
    create(optionsObj){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const hashedPassword = await bcrypt.hash(optionsObj.password, crypt.saltRounds);

                    const pool = await sql.connect(con);
                    const result1 = await pool.request()
                    .input('userEmail', sql.NVarChar(255), this.userEmail)
                    .input('userFirstName', sql.NVarChar(50), this.userFirstName)
                    .input('userLastName', sql.NVarChar(50), this.userLastName)
                    .input('userUsername', sql.NVarChar(50), this.userUsername)
                    .input('userPhone', sql.Int, this.userPhone)
                    .input('userBirthDay', sql.NVarChar(50), this.userBirthDay)
                    .input('hashedPassword', sql.NVarChar(255), hashedPassword)
                    .query(`INSERT INTO forexUser (userEmail, userFirstName, userLastName, userUsername, userPhone, userBirthDay)
                            VALUES (@userEmail, @userFirstName, @userLastName, @userUsername, @userPhone, @userBirthDay);
                    
                            SELECT userID, userEmail
                            FROM forexUser
                            WHERE forexUser.userID = SCOPE_IDENTITY();
                            
                            INSERT INTO forexPassword (FK_userID, hashPassword)
                            VALUES (SCOPE_IDENTITY(), @hashedPassword)`);
                    
                    console.log(result1);

                    if (result1.recordset.length != 1) throw {statusCode: 500, message: 'DB is corrupt from user.js'};

                    const result2 = await pool.request()
                    .input('userID', sql.Int, result1.recordset[0].userID)
                    .query(`INSERT INTO forexUserRole (FK_userID, FK_roleID)
                            VALUES (@userID, 3);
                            
                            SELECT *
                            FROM forexUserRole
                            
                            INNER JOIN forexRole
                            ON forexUserRole.FK_roleID = forexRole.roleID
                            WHERE forexUserRole.FK_userID = @userID`);
                    console.log(result2);

                    if (result2.recordset.length != 1) throw {statusCode: 500, message: 'DB is corrupt from user.js'};

                    const record = {
                        userId: result1.recordset[0].userID,
                        userEmail: result1.recordset[0].userEmail,
                        userFirstName: result1.recordset[0].userFirstName,
                        userLastName: result1.recordset[0].userLastName,
                        userUsername: result1.recordset[0].userUsername,
                        userPhone: result1.recordset[0].userPhone,
                        userBirthDay: result1.recordset[0].userBirthDay,
                        role: {
                            roleId: result2.recordset[0].roleID,
                            roleName: result2.recordset[0].roleName,
                            roleDescription: result2.recordset[0].roleDescription,
                        }
                    }

                    const {error} = User.validate(record);
                    if (error) throw {statusCode: 409, message: error};

                    resolve(new User(record));

                } catch (err) {
                    console.log(err);
                    let errorMessage;
                    if(!err.statusCode){
                        errorMessage = {
                            statusCode: 500,
                            message: err + 'we are here'
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

    //PUT (UPDATE) stuff
    update(){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    console.log('we are here');
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('userID', sql.Int, this.userId)
                    .input('userEmail', sql.NVarChar(50), this.userEmail)
                    .input('userFirstName', sql.NVarChar(50), this.userFirstName)
                    .input('userLastName', sql.NVarChar(50), this.userLastName)
                    .input('userUsername', sql.NVarChar(50), this.userUsername)
                    .input('userPhone', sql.Int, this.userPhone)
                    .input('userBirthDay', sql.NVarChar(50), this.userBirthDay)
                    .query(`
                            
                            
                            UPDATE forexUser
                            SET userEmail = @userEmail,
                            userFirstName = @userFirstName,
                            userLastName = @userLastName,
                            userUsername = @userUsername,
                            userPhone = @userPhone,
                            userBirthDay = @userBirthDay
                            WHERE userID = @userID
                            
                            SELECT *
                            FROM forexUser
                            WHERE userID = @userID;`);

                    console.log(result);
                    if (!result.recordset[0]) throw {message: 'User not found. Not updated.'};
                    
                    const record = {
                        //userId: result1.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName,
                        userLastName: result.recordset[0].userLastName,
                        userUsername: result.recordset[0].userUsername,
                        userPhone: result.recordset[0].userPhone,
                        userBirthDay: result.recordset[0].userBirthDay,
                        role: {
                        //     roleId: result2.recordset[0].roleID,
                            roleName: result.recordset[0].roleName,
                            roleDescription: result.recordset[0].roleDescription,
                        }
                    }
                    

                    const {error} = User.validate(record);
                    if (error) throw error;

                    resolve(new User(record));
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        });
    };

    //DELETE (DELETE) stuff

    delete(){
        return new Promise((resolve, reject) => {
            (async ()=>{
            try {
                const pool = await sql.connect(con);
                const result = await pool.request()
                .input('userID', sql.Int, this.userId)
                .query(`SELECT *
                        FROM forexUser
                        INNER JOIN forexUserRole
                        ON forexUser.userID = forexUserRole.FK_userID
                        INNER JOIN forexRole
                        ON forexUserRole.FK_roleID = forexRole.roleID
                        WHERE forexUser.userID = @userID
                        
                        DELETE FROM forexUserRole
                        WHERE FK_userID = @userID
                        
                        DELETE FROM forexPassword
                        WHERE FK_userID = @userID
                        
                        DELETE FROM forexUser
                        WHERE userID = @userID`);
                
                console.log(result);

                if(result.recordset.length == 0) throw {statusCode: 404, message: "User not found"}
                if(result.recordset.length > 1) throw {statusCode: 500, message: "Multiple IDs: DB is corrupt"}

                const userWannabe = {
                    userId: result.recordset[0].userID,
                    userEmail: result.recordset[0].userEmail,
                    userFirstName: result.recordset[0].userFirstName,
                    userLastName: result.recordset[0].userLastName,
                    userUsername: result.recordset[0].userUsername,
                    userPhone: result.recordset[0].userPhone,
                    userBirthDay: result.recordset[0].userBirthDay,
                    role: {
                        roleId: result.recordset[0].roleID,
                        roleName: result.recordset[0].roleName,
                        roleDescription: result.recordset[0].roleDescription,
                    }
                }

                const {error} = User.validate(userWannabe);
                if (error) throw error;

                resolve(new User(userWannabe));

            } catch (err) {
                console.log(err);
                    reject(err);
            }
            sql.close();
            })();
        });
    }

}


module.exports = User;