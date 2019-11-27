"user strict";
var sql = require("../db.js");

//User object constructor
var User = function(user) {
    this.cpf = user.cpf;
    this.nome = user.nome;
    this.cargo = user.cargo;
    this.matricula = user.matricula;
    this.departamento = user.departamento;
    this.senha = user.senha;
};
User.createUser = function(newUser, result) {
    sql.query("INSERT INTO colaboradores set ?", newUser, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res.insertId);
        }
    });
};
User.getUserByCpf = function(cpf, result) {
    sql.query("Select * from colaboradores where cpf = ?", cpf, function(
        err,
        res
    ) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
User.getAllUser = function(result) {
    sql.query("Select * from colaboradores", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log("users : ", res);

            result(null, res);
        }
    });
};
User.updateByCpf = function(id, user, result) {
    sql.query(
        "UPDATE colaboradores SET user = ? WHERE cpf = ?", [user.user, id],
        function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        }
    );
};
User.remove = function(id, result) {
    sql.query("UPDATE colaboradores ativo = 0 WHERE cpf = ?", [id], function(
        err,
        res
    ) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = User;