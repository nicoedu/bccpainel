"use strict";
const Noticia = require("../models/Noticia");

exports.list_all_noticias = function (req, res) {
  var page = parseInt(req.params.page, 10) || 0;
  Noticia.getAllNoticia(page, function (err, noticia) {
    if (err) res.send(err);
    res.send(noticia);
  });
};

exports.get_noticias_by_search_query = function (req, res) {
  Noticia.getNoticiaByQuery(req.params.search, function (err, noticias) {
    if (err) res.send(err);
    res.send(noticias);
  });
};

exports.create_a_noticia = function (req, res) {
  var new_noticia = new Noticia(req.body);
  //handles null error
  Noticia.createNoticia(new_noticia, function (err, noticia) {
    if (err) {
      res.status(400).send(err);
      return;
    }

    res.status(200).json(noticia);
  });
};

exports.read_a_noticia = function (req, res) {
  Noticia.getNoticiaById(req.query.id, function (err, noticia) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).json(noticia);
  });
};

exports.update_a_noticia = function (req, res) {
  Noticia.updateByid(req.query.id, new Noticia(req.body), function (
    err,
    noticia
  ) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).json(noticia);
  });
};

exports.delete_a_noticia = function (req, res) {
  Noticia.remove(req.query.id, function (err, noticia) {
    if (err) {
      res.status(400).send(err);
      return;
    } else {

      res.status(200).json({ ok: true, message: "Noticia removida com sucesso" });
    }
  });
};
