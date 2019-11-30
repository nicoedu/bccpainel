"use strict";
const Departamento = require("../models/Departamento");

exports.list_all_departamentos = function(req, res) {
    Departamento.getAllDepartamento(function(err, departamento) {
        if (err) res.send(err);
        res.send(departamento);
    });
};

exports.create_a_departamento = function(req, res) {
    var new_departamento = new Departamento(req.body);
    //handles null error
    Departamento.createDepartamento(new_departamento, function(
        err,
        departamento
    ) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).json(departamento);
    });
};

exports.read_a_departamento = function(req, res) {
    Departamento.getDepartamentoById(req.query.id, function(err, departamento) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json(departamento);
    });
};

exports.update_a_departamento = function(req, res) {
    Departamento.updateByCpf(req.query.cpf, new Departamento(req.body), function(
        err,
        departamento
    ) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json(departamento);
    });
};

exports.delete_a_departamento = function(req, res) {
    Departamento.remove(req.query.cpf, function(err, departamento) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json({ message: "Usuário desativado com sucesso" });
    });
};