"use strict";
var sql = require("../db.js");

//Departamento object constructor
var Departamento = function(departamento) {
    this.iddepartamento = departamento.id;
    this.nomedepartamento = departamento.nome;
};
Departamento.createDepartamento = function(newDepartamento, result) {
    sql.query("INSERT IGNORE INTO departamento set ?", newDepartamento, function(
        err,
        res
    ) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};
Departamento.getDepartamentoById = function(iddepartamento, result) {
    sql.query(
        "Select * from departamento where iddepartamento = ? ",
        iddepartamento,
        function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res);
                result(null, res);
            }
        }
    );
};
Departamento.getAllDepartamento = function(result) {
    sql.query("Select * from departamento", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
Departamento.updateById = function(id, departamento, result) {
    sql.query(
        "UPDATE departamento SET departamento = ? WHERE iddepartamento = ?", [departamento.departamento, id],
        function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
};

Departamento.remove = function(id, result) {
    sql.query("DELETE FROM departamento WHERE iddepartamento = ?", [id], function(
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

module.exports = Departamento;