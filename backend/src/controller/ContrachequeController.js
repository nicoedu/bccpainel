"use strict";
const Contracheque = require("../models/Contracheque");

exports.list_all_contracheques = function (req, res) {
    Contracheque.getAllContracheque(function (err, contracheque) {
        if (err) {
            res.send(err);
            return;
        }

        res.status(200).send(contracheque);
    });
};

exports.create_a_contracheque = function (req, res) {
    var new_contracheque = new Contracheque(req.body);
    //handles null error
    Contracheque.createContracheque(new_contracheque, function (
        err,
        contracheque
    ) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).json(contracheque);
    });
};

exports.read_a_contracheque = function (req, res) {
    if (req.user.id != req.query.cpf) {
        res.status(401).send("Invalid Token");
        return;
    }
    Contracheque.getContrachequeByCpf(req.query.cpf, function (err, contracheque) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json(contracheque);
    });
};

exports.read_a_contracheque_date = function (req, res) {
    if (req.user.id != req.query.cpf) {
        res.status(401).send("Invalid Token");
        return;
    }
    Contracheque.getContrachequeByCpfandDate(
        req.query.cpf,
        req.params.data,
        function (err, contracheque) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(200).json(contracheque);
        }
    );
};

exports.delete_a_contracheque = function (req, res) {
    Contracheque.remove(req.query.cpf, function (err, contracheque) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json({ message: "Contracheque removido com sucesso" });
    });
};