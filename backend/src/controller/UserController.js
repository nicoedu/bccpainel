"use strict";
const User = require("../models/User");

exports.list_all_users = function(req, res) {
    User.getAllUser(function(err, user) {
        console.log("controller");
        if (err) res.send(err);
        console.log("res", user);
        res.send(user);
    });
};

exports.create_a_user = function(req, res) {
    var new_user = new User(req.body);
    //handles null error
    User.createUser(new_user, function(err, sucess) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).send(sucess);
    });
};

exports.read_a_user = function(req, res) {
    User.getUserByCpf(req.query.cpf, function(err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json(user);
    });
};

exports.update_a_user = function(req, res) {
    User.updateByCpf(req.query.cpf, new User(req.body), function(err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json(user);
    });
};

exports.delete_a_user = function(req, res) {
    User.remove(req.query.cpf, function(err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json({ message: "Usuário desativado com sucesso" });
    });
};