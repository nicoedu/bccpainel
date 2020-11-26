const fs = require('fs');
const fileHandler = require('../util/fileHandler');
const pdf2base64 = require('pdf-to-base64');
const UPLOAD_PDF_DIRECTORY = process.env.LOCAL_UPLOAD_CONTRACHEQUE_COMPLETO;
const GENERATED_PDF_DIRECTORY = process.env.LOCAL_UPLOAD_CONTRACHEQUE_DIVIDIDO;
const NOTICIA_IMAGES_DIRECTORY = process.env.LOCAL_UPLOAD_IMAGEM_NOTICIA;

module.exports = {
	async send_pdf(req, res) {
		var filename = req.query.filename;

		pdf2base64(GENERATED_PDF_DIRECTORY + filename)
			.then((response) => {
				res.send(response);
			})
			.catch((error) => {
				console.log(error);
				res.status(404).end();
			});
	},
	async save_pdf(req, res) {
		var fstream;
		var fstream2;
		req.pipe(req.busboy);
		var date = 0;
		var saved = 0;
		var resolve = await (async () => {
			return new Promise((resolve, reject) => {
				req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
					date = fieldname;
					file.on('limit', () => {
						console.log(options, `Size limit reached for ${field}->${filename}, bytes:${getFileSize()}`);
					});
					if (mimetype == "text/plain") {
						fstream = fs.createWriteStream(UPLOAD_PDF_DIRECTORY + date + '.txt');
						file.pipe(fstream);
						fstream.on('finish', function () {
							saved += 1;
							if (saved > 1) {
								resolve({ sucess: true, date: date });
							}
						})
					} else if (mimetype == "application/pdf") {
						fstream2 = fs.createWriteStream(UPLOAD_PDF_DIRECTORY + date + '.pdf');
						file.pipe(fstream2);
						fstream2.on('finish', function () {
							saved += 1;
							if (saved > 1) {
								resolve({ sucess: true, date: date });
							}
						})
					} else {
						reject({ sucess: false, error: "Invalid file type" });
					}

				});

				req.busboy.on('finish', function () {

					res.status(200).send({ success: true });
				})
			});
		})();
		if (resolve.sucess) {
			await fileHandler(date, UPLOAD_PDF_DIRECTORY, GENERATED_PDF_DIRECTORY);
		} else {
			return res.status(400).end(resolve.error);
		}
	},

	async send_image(req, res) {

		var filename = req.query.filename;
		if (filename == 'null') {
			res.status(200).sendFile(NOTICIA_IMAGES_DIRECTORY + 'bbcLogo.jpg');
		}
		res.status(200).sendFile(NOTICIA_IMAGES_DIRECTORY + filename, (err) => {
			if (err) {
			}
		});
	},
	async save_image(req, res) {
		var fstream;
		req.pipe(req.busboy);
		var resolve = await (async () => {
			return new Promise((resolve, reject) => {
				req.busboy.on('file', function (fieldname, file, filename) {
					fstream = fs.createWriteStream(NOTICIA_IMAGES_DIRECTORY + filename);
					file.pipe(fstream);
					fstream.on('close', function () {
						resolve({ sucess: true, filename: filename });
					});
					fstream.on('error', function (err) {
						console.log(err);
						reject({ sucess: false, error: err });
					});
				});
			});
		})();
		if (resolve.sucess) {
			res.sendStatus(200);
		} else {
			return res.status(400).end(resolve.error);
		}
	}
};
