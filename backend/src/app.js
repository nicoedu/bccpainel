const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

console.log(process.env.DBHOST);
const routes = require("./routes");

//midlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("/uploads"));
app.use(routes);

//Listenner
app.listen(3333);