const fs = require("fs");
const pdfHandler = require("../util/pdfHandler");
const pdf2base64 = require("pdf-to-base64");
const UPLOAD_PDF_DIRECTORY =
  "/home/nicoedu/Documents/BBC/files/contrachequeCompleto/";
const GENERATED_PDF_DIRECTORY =
  "/home/nicoedu//Documents/BBC/files/contrachequeDividido/";
const NOTICIA_IMAGES_DIRECTORY =
  "/home/nicoedu/Documents/BBC/files/images/noticia/";

module.exports = {
  //TODO test this out
  async send_pdf(req, res) {
    // if (!req.query.cpf) {
    //   res.send(400).send("Dados invalidos");
    //   return;
    // }
    // var cpf = req.query.cpf;
    // if (!req.query.date) {
    //   res.send(400).send("Dados invalidos");
    //   return;
    // }
    // var date = req.query.date;

    // filename = cpf + String(new Date(date).getTime() / 1000);
    var filename = req.query.filename + ".pdf";

    // var file = fs.createReadStream(
    //   "/home/nicoedu/Documents/BBC/meu/backend/uploads/" + filename
    // );
    // var stat = fs.statSync(
    //   "/home/nicoedu/Documents/BBC/meu/backend/uploads/" + filename
    // );
    pdf2base64(GENERATED_PDF_DIRECTORY + filename)
      .then(response => {
        res.send(response);
      })
      .catch(error => {
        console.log(error);
      });

    // res.setHeader("Content-Length", stat.size);
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "attachment; filename=" + filename);
    // file.pipe(res);
  },
  async save_pdf(req, res) {
    var fstream;
    req.pipe(req.busboy);
    var resolve = await (async () => {
      return new Promise((resolve, reject) => {
        req.busboy.on("file", function(fieldname, file, filename) {
          console.log("Uploading: " + filename);
          fstream = fs.createWriteStream(UPLOAD_PDF_DIRECTORY + filename);
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
        UPLOAD_PDF_DIRECTORY + resolve.filename,
        GENERATED_PDF_DIRECTORY
      );
      return;
    } else {
      return res.status(400).end(resolve.error);
    }
  },
  async save_image(req, res) {
    var fstream;
    req.pipe(req.busboy);
    var resolve = await (async () => {
      return new Promise((resolve, reject) => {
        req.busboy.on("file", function(fieldname, file, filename) {
          fileFormat = filename.split(".")[1];
          console.log("Uploading: " + filename);
          fstream = fs.createWriteStream(
            NOTICIA_IMAGES_DIRECTORY + fieldname + "." + fileFormat
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
