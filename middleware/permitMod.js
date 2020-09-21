module.exports = (req, res, next) => {
    if((req.user.role.roleName == 'Mod') || (req.user.role.roleName == 'Admin')){
        next();
    } else {
        errorMessage = {
            statusCode: 401,
            message: "Access denied: unauthorized user"
        }
        res.status(errorMessage.statusCode).send(JSON.stringify(errorMessage));
    }

};