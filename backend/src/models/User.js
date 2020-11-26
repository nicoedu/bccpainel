"use strict";
var sql = require("../db.js");

//User object constructor
var User = function (user) {
  this.cpf = user.cpf;
  this.nome = user.nome;
};
User.createUser = function (newUser, result) {
  sql.query("INSERT INTO colaborador set ?", newUser, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, true);
    }
  });
};

User.bulkCreateUser = function (usersArray, result) {
  let keys = Object.keys(usersArray[0]);
  let values = usersArray.map(obj => keys.map(key => obj[key]));
  let sqlString = 'INSERT INTO colaborador (' + keys.join(',') + ') VALUES ?';
  sql.query(sqlString, [values], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, true);
    }
  });
}

User.getUserByCpfWithPassword = function (cpf, result) {
  sql.query("Select * from colaborador where cpf = ?", cpf, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

User.getUserByCpf = function (cpf, result) {
  sql.query(
    "Select cpf,nome from colaborador where cpf = ?",
    cpf,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};
User.getAllUser = function (result) {
  sql.query("Select * from colaborador", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};
User.updatePasswordByCpf = function (id, password, result) {
  sql.query(
    "UPDATE colaborador SET senha = ? WHERE cpf = ?",
    [password, id],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};
User.remove = function (id, result) {
  sql.query("UPDATE colaborador SET ativo = 0 WHERE cpf = ?", [id], function (
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

module.exports = User;
