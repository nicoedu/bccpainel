const express = require("express");
const busboy = require("connect-busboy");
const queue = require('express-queue');
const UserController = require("./controller/UserController");
const ContrachequeController = require("./controller/ContrachequeController");
const NoticiaController = require("./controller/NoticiaController");
const AuthController = require("./controller/AuthController");
const FileController = require("./controller/FileController");
const DepartamentoController = require("./controller/DepartamentoController");
const verifyTokenAdmin = require("./auth/verifyTokenAdmin");
const verifyToken = require("./auth/verifyTokenUser");

const routes = express.Router();

//Login
routes.post("/api/login", AuthController.login);
routes.post("/api/updatePass", verifyToken, AuthController.updatePassword);
routes.post(
  "/api/resetPass",
  verifyTokenAdmin,
  AuthController.updatePasswordAdmin
);


//Routes to users
routes.post("/api/user", verifyTokenAdmin, UserController.create_a_user);
routes.get("/api/user", verifyToken, UserController.read_a_user);
routes.delete("/api/user", verifyTokenAdmin, UserController.delete_a_user);
routes.post("/api/user/edit", verifyToken, UserController.update_a_user);

//Routes to contracheque
routes.post(
  "/api/contracheque",
  verifyToken,
  ContrachequeController.create_a_contracheque
);
routes.get(
  "/api/contracheque",
  verifyToken,
  ContrachequeController.read_a_contracheque
);
routes.get(
  "/api/contracheque/:data",
  verifyToken,
  ContrachequeController.read_a_contracheque_date
);
routes.delete(
  "/api/contracheque",
  verifyTokenAdmin,
  ContrachequeController.delete_a_contracheque
);

//Routes to noticias
routes.post(
  "/api/noticia",
  verifyTokenAdmin,
  NoticiaController.create_a_noticia
);
routes.get(
  "/api/noticias/:departamento",
  verifyToken,
  NoticiaController.list_noticias_by_dept
);
routes.get("/api/noticias", verifyToken, NoticiaController.list_all_noticias);
routes.get("/api/noticia", verifyToken, NoticiaController.read_a_noticia);
routes.delete(
  "/api/noticia",
  verifyTokenAdmin,
  NoticiaController.delete_a_noticia
);
routes.post(
  "/api/noticia/edit",
  verifyTokenAdmin,
  NoticiaController.update_a_noticia
);
routes.get(
  "/api/noticias/search/:search",
  verifyToken,
  NoticiaController.get_noticias_by_search_query
);

//Routes to filesupload
routes.post("/api/upload", verifyTokenAdmin, busboy(), queue({ activeLimit: 1, queuedLimit: -1}), FileController.save_pdf);
routes.post(
  "/api/image",
  verifyTokenAdmin,
  busboy(),
  FileController.save_image
);
routes.get("/api/image", verifyTokenAdmin, FileController.send_image);
routes.get("/api/downloadpdf", verifyToken, FileController.send_pdf);

//Routes to departamento
routes.get(
  "/api/dartamentos",
  verifyTokenAdmin,
  DepartamentoController.list_all_departamentos
);
routes.get(
  "/api/dartamento",
  verifyToken,
  DepartamentoController.read_a_departamento
);

module.exports = routes;
