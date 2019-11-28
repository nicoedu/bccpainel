"use strict";
const User = require("../models/User");
const Contracheque = require("../models/Contracheque");

exports.insertIntoDatabase = (userObject, contrachequeObject) => {
    return new Promise(resolve => {
        var user = new User(userObject);
        var contracheque = new Contracheque(contrachequeObject);
        console.log("inserting user " + userObject.nome + " into database");
        User.createUser(user, (err, res) => {
            //errno == 1062 é o erro de chave duplicada do mysql
            if (err && err.errno != 1062) {
                console.log(err);
                return err;
            } else {
                Contracheque.createContracheque(contracheque, (err, res) => {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        return true;
                    }
                });
            }
        });
    });
};