const express = require("express");
const UserController = require("./controller/UserController");
const ContrachequeController = require("./controller/ContrachequeController");
const AuthController = require("./controller/AuthController");
const verifyToken = require("./verifyToken");

const routes = express.Router();

//Login
// routes.post("/login", AuthController.login);

//Routes to users
routes.post("/user", UserController.create_a_user);
routes.get("/user", UserController.read_a_user);
routes.delete("/user", verifyToken, UserController.delete_a_user);
routes.post("/user/edit", UserController.update_a_user);

//Routes to contracheque
routes.post("/contracheque", ContrachequeController.create_a_contracheque);
routes.get("/contracheque", ContrachequeController.read_a_contracheque);
routes.get(
    "/contracheque/:data",
    ContrachequeController.update_a_contracheque_date
);
routes.delete(
    "/contracheque",
    verifyToken,
    ContrachequeController.delete_a_contracheque
);

//Routes to noticias
// routes.post("/user", UserController.create_a_user);
// routes.get("/user/:userId", UserController.read_a_user);
// routes.delete("/user", verifyToken, UserController.delete_a_user);
// routes.post("/user/edit", UserController.update_a_user);

module.exports = routes;