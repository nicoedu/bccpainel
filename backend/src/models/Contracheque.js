"contracheque strict";
var sql = require("../db.js");

//Contracheque object constructor
var Contracheque = function(contracheque) {
    this.cpf = contracheque.cpf;
    this.data_referencia = contracheque.data_referencia;
    this.arquivo_endereco = contracheque.arquivo_endereco;
};
Contracheque.createContracheque = function(newContracheque, result) {
    sql.query("INSERT INTO contracheque set ?", newContracheque, function(
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
Contracheque.getContrachequeByCpf = function(cpf, result) {
    sql.query("Select * from contracheque where cpf = ? ", cpf, function(
        err,
        res
    ) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
    });
};
Contracheque.getAllContracheque = function(result) {
    sql.query("Select * from contracheque", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log("contracheque : ", res);

            result(null, res);
        }
    });
};
Contracheque.getContrachequeByCpfandDate = function(
    cpf,
    data_referencia,
    result
) {
    sql.query(
        "Select * from contracheque where cpf = ? and data_referencia = ?", [cpf, data_referencia],
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
Contracheque.remove = function(id, result) {
    sql.query("DELETE FROM contracheque WHERE cpf = ?", [id], function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Contracheque;