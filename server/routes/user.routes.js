const UserController = require("../controllers/user.controller");
const verifyJWT = require("../config/verifyJWT.config")

module.exports = app => {
    app.post('/api/users/create', UserController.createUser);
    app.post('/api/users/login', UserController.login);
    app.get('/api/users/refresh', UserController.refreshToken);
    app.get('/api/users/logout', UserController.logout);
    app.put('/api/users/update', verifyJWT.verify, UserController.updateExistingUser);
    app.delete('/api/users/delete', verifyJWT.verify, UserController.deleteExistingUser);
}