const express = require("express");
const routes = new express.Router();
const UserController = require("./controller/UserController");
const PostController = require("./controller/PostController");

routes.post('/register', UserController.register);
routes.get('/listUser', UserController.listUser);
routes.post('/login', UserController.login);
routes.post('/searchPost', PostController.searchPost);
routes.post('/registerPost', PostController.registerPost);
module.exports = routes;
