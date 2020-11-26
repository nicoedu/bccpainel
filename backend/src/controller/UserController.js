"use strict";
const User = require("../models/User");

exports.list_all_users = function (req, res) {
  User.getAllUser(function (err, user) {
    if (err) res.send(err);

    res.send(user);
  });
};

exports.create_a_user = function (req, res) {
  var new_user = new User(req.body);
  //handles null error
  User.createUser(new_user, function (err, sucess) {
    if (err) {
      res.status(400).send(err);
      return;
    }

    res.status(200).send(sucess);
  });
};

exports.read_a_user = function (req, res) {
  if (req.user.id != req.query.cpf) {
    res.status(401).send(req.query.cpf);
    return;
  }
  User.getUserByCpf(req.query.cpf, function (err, user) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).json(user);
  });
};

exports.update_a_user = function (req, res) {
  if (req.user.id != req.query.cpf && req.user.id != "admin" && req.user.id != "ADMIN") {
    res.status(401).send("Invalid Token");
    return;
  }
  User.updatePasswordByCpf(req.query.cpf, req.body.password, function (
    err,
    user
  ) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).json(user);
  });
};

exports.delete_a_user = function (req, res) {
  User.remove(req.query.cpf, function (err, user) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).json({ message: "Usuário desativado com sucesso" });
  });
};
