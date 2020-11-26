"noticia strict";
var sql = require("../db.js");

//Noticia object constructor
var Noticia = function (noticia) {
  this.titulo = noticia.titulo;
  this.texto = noticia.texto;
  noticia.postado_em = new Date().getTime().toString();
  this.postado_em = noticia.postado_em;
  this.imagem_endereco = noticia.imagem_endereco;
};
Noticia.createNoticia = function (newNoticia, result) {
  sql.query("INSERT INTO noticia set ?", newNoticia, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};
Noticia.getNoticiaById = function (idnoticia, result) {
  sql.query(
    "Select idnoticia,titulo,texto,postado_em, imagem_endereco FROM noticia where idnoticia = ?",
    idnoticia,
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
Noticia.getNoticiaByQuery = function (query, result) {
  sql.query(
    "Select idnoticia,titulo,postado_em,imagem_endereco FROM noticia where texto like '%" +
    query +
    "%'",
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
Noticia.getAllNoticia = function (page, result) {
  var numRows;
  var queryPagination;
  var numPages;
  var numPerPage = 20;
  var skip = page * numPerPage;
  // Here we compute the LIMIT parameter for MySQL query
  var limit = skip + ", " + numPerPage;
  sql.query("SELECT count(*) as numRows FROM noticia", function (err, res) {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    numRows = res[0].numRows;
    numPages = Math.ceil(numRows / 20);
    sql.query(
      "Select idnoticia,titulo,postado_em,imagem_endereco FROM noticia order by postado_em desc limit " +
      limit,
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else {
          var responsePayload = {
            noticias: res
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined
            };
            result(null, responsePayload);
          } else
            responsePayload.pagination = {
              err:
                "queried page " +
                page +
                " is >= to maximum page number " +
                numPages
            };
          result(err, null);
        }
      }
    );
  });
};
Noticia.updateById = function (id, noticia, result) {
  sql.query(
    "UPDATE noticia SET noticia = ? WHERE idnoticia = ?",
    [noticia.noticia, id],
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
Noticia.remove = function (id, result) {
  sql.query("DELETE FROM noticia WHERE idnoticia = ?", [id], function (
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

module.exports = Noticia;
