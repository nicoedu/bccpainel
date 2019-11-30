const fs = require("fs");
const pdfHandler = require("../util/pdfHandler");

module.exports = {
    async save_pdf(req, res) {
        var fstream;
        req.pipe(req.busboy);
        var resolve = await (async() => {
            return new Promise((resolve, reject) => {
                req.busboy.on("file", function(fieldname, file, filename) {
                    console.log("Uploading: " + filename);
                    fstream = fs.createWriteStream(
                        "/home/nicoedu/Documents/BBC/meu/backend/uploads/" + filename
                    );
                    file.pipe(fstream);
                    fstream.on("close", function() {
                        resolve({ sucess: true, filename: filename });
                    });
                    fstream.on("error", function(err) {
                        console.log(err);
                        reject({ sucess: false, error: err });
                    });
                });
            });
        })();
        if (resolve.sucess) {
            res.status(200).send(JSON.stringify({ top: "top" }));
            pdfHandler.pdfLoader(
                "/home/nicoedu/Documents/BBC/meu/backend/uploads/" + resolve.filename,
                "/home/nicoedu/Documents/BBC/meu/backend/src/util/output/"
            );
            return;
        } else {
            return res.status(400).end(resolve.error);
        }
    },
    async save_image(req, res) {
        var fstream;
        req.pipe(req.busboy);
        var resolve = await (async() => {
            return new Promise((resolve, reject) => {
                req.busboy.on("file", function(fieldname, file, filename) {
                    console.log("Uploading: " + filename);
                    fstream = fs.createWriteStream(
                        "/home/nicoedu/Documents/BBC/meu/backend/noticia" + filename
                    );
                    file.pipe(fstream);
                    fstream.on("close", function() {
                        resolve({ sucess: true, filename: filename });
                    });
                    fstream.on("error", function(err) {
                        console.log(err);
                        reject({ sucess: false, error: err });
                    });
                });
            });
        })();
        if (resolve.sucess) {
            res.status(200).send(JSON.stringify({ top: "top" }));
        } else {
            return res.status(400).end(resolve.error);
        }
    }
};