const express = require("express");
const busboy = require("connect-busboy");
const UserController = require("./controller/UserController");
const ContrachequeController = require("./controller/ContrachequeController");
const NoticiaController = require("./controller/NoticiaController");
const AuthController = require("./controller/AuthController");
const FileController = require("./controller/FileController");
const DepartamentoController = require("./controller/DepartamentoController");
const verifyToken = require("./verifyToken");

const routes = express.Router();

//Login
routes.post("/login", AuthController.login);
routes.post("/updatePass", AuthController.updatePassword);

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
    ContrachequeController.read_a_contracheque_date
);
routes.delete(
    "/contracheque",
    verifyToken,
    ContrachequeController.delete_a_contracheque
);

//Routes to noticias
routes.post("/noticia", NoticiaController.create_a_noticia);
routes.get("/noticia/:departamento", NoticiaController.list_noticias_by_dept);
routes.get("/noticias", NoticiaController.list_all_noticias);
routes.get("/noticia", NoticiaController.read_a_noticia);
routes.delete("/noticia", verifyToken, NoticiaController.delete_a_noticia);
routes.post("/noticia/edit", verifyToken, NoticiaController.update_a_noticia);

//Routes to filesupload
routes.post("/upload", busboy(), FileController.save_pdf);
routes.post("/image", busboy(), FileController.save_image);

//Routes to departamento
routes.get("/departamentos", DepartamentoController.list_all_departamentos);
routes.get("/departamento", DepartamentoController.read_a_departamento);

module.exports = routes;