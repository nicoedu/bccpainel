"noticia strict";
var sql = require("../db.js");

//Noticia object constructor
var Noticia = function(noticia) {
    this.titulo = noticia.titulo;
    this.texto = noticia.texto;
    noticia.postado_em = new Date().getTime().toString();
    this.postado_em = noticia.postado_em;
    this.departamento = noticia.departamento;
    this.postado_por = noticia.postado_por;
    this.imagem_endereco = noticia.imagem_endereco;
};
Noticia.createNoticia = function(newNoticia, result) {
    sql.query("INSERT INTO noticia set ?", newNoticia, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};
Noticia.getNoticiaById = function(idnoticia, result) {
    sql.query("Select * from noticia where idnoticia = ?", idnoticia, function(
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
Noticia.getAllNoticia = function(result) {
    sql.query("Select * from noticia", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
Noticia.getAllNoticiaByDepartamento = function(
    departamento,
    includeAllDepartament,
    result
) {
    includeAllDepartament
        ?
        (query =
            "Select * from noticia where departamento like '%?%' or departamento IS NULL") :
        (query = "Select * from noticia where departamento like '%?%'");

    sql.query(query, '"' + departamento + '"', function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log("noticias : ", res);

            result(null, res);
        }
    });
};
Noticia.updateById = function(id, noticia, result) {
    sql.query(
        "UPDATE noticia SET noticia = ? WHERE idnoticia = ?", [noticia.noticia, id],
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
Noticia.remove = function(id, result) {
    sql.query("UPDATE noticia SET ativo = 0 WHERE idnoticia = ?", [id], function(
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