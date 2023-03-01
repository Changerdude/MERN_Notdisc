const UserController = require("../controllers/user.controller");

module.exports = app => {
    app.post('/api/users/create', UserController.createUser);
    app.post('/api/users/login', UserController.login);
    app.put('/api/users/update/:id', UserController.updateExistingUser);
    app.delete('/api/users/delete/:id', UserController.deleteExistingUser);
}