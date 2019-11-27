const express = require("express");
const app = express();
const cors = require("cors");
//const mysql = require("mysql");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("dotenv/config");

//midlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("/uploads"));
app.use(routes);

//Listenner
app.listen(3333);