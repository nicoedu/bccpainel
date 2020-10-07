"use strict";
const User = require("../models/User");
const Contracheque = require("../models/Contracheque");
const Departamento = require("../models/Departamento");

exports.insertIntoDatabase = (
  userObject,
  departamentObject,
  contrachequeObject
) => {
  return new Promise(resolve => {
    var user = new User(userObject);
    var contracheque = new Contracheque(contrachequeObject);
    var departament = new Departamento(departamentObject);
    // console.log(
    //     "inserting departament " + departamentObject.nome + " into database"
    // );
    Departamento.createDepartamento(departament, (err, res) => {
      if (err) {
        // console.log(err);
        return err;
      } else {
        // console.log("inserting user " + userObject.nome + " into database");
        User.createUser(user, (err, res) => {
          //errno == 1062 é o erro de chave duplicada do mysql
          if (err && err.errno != 1062) {
            // console.log(err);
            return err;
          } else {
            // console.log(
            //     "inserting payroll of user with cpf " +
            //     contrachequeObject.cpf +
            //     " into database"
            // );
            Contracheque.createContracheque(contracheque, (err, res) => {
              if (err) {
                // console.log(err);
                return err;
              } else {
                return true;
              }
            });
          }
        });
      }
    });
  });
};
