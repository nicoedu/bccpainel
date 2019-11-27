"user strict";
require("dotenv/config");
var mysql = require("mysql");

//local mysql db connection
var connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBBASE
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;