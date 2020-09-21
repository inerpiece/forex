const jwt = require('jsonwebtoken');
const crypt = require('../config/encrypt');

module.exports = async (req, res, next) => {
    // check if token is attached to req.header
    // --> throw: 401 access denied: no token provided
    //     send a response with this error (request pipeline done)
    // decode the token (with the secret key)
    // --> if NOT successful: invalid token, or tempered with token
    //     throw: 400 bad request:
    //     send res with error (request pipeline done)
    // add the decoded content to the request object
    // move onto the next in the request pipeline

    try {
        const token = req.header('x-authentication-token');
        if (!token) throw {statusCode: 401, message: 'Access Denied no token provided'};

        console.log(token);
        const decodedToken = await jwt.verify(token, crypt.jwtPrivateKey);
        console.log(decodedToken);

        req.user = decodedToken;
        next();
    } catch (err) {
        let errorMessage;
        if (!err.statusCode){
            errorMessage = {
                statusCode: 400,
                message: err
            } 
        } else {
            errorMessage = err;
        }
        res.status(errorMessage.statusCode).send(JSON.stringify(errorMessage));
    }
};