const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
//const mysql = require("mysql");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("dotenv/config");

//midlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(routes);

//Connect to db
// var connection = mysql.createConnection({
//     host: process.env.DBHOST,
//     user: process.env.DBUSER,
//     password: process.env.DBPASSWORD,
//     base: process.env.DBBASE
// });

app.post("/upload", upload.fields([{ name: "file", maxCount: 3 }]), function(
    req,
    res
) {
    console.log(req.files);
    fs.writeFile("test.pdf", req.file, function(err) {
        if (err) {
            console.log(err);
            res.send(500);
        }
        console.log("The file was saved!");
        res.status(200).send("top");
    });
});

//Listenner
app.listen(3333);