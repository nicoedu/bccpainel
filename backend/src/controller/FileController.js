const fs = require('fs');
const pdfHandler = require('../util/pdfHandler');
const pdf2base64 = require('pdf-to-base64');
const UPLOAD_PDF_DIRECTORY = process.env.LOCAL_UPLOAD_CONTRACHEQUE_COMPLETO;
const GENERATED_PDF_DIRECTORY = process.env.LOCAL_UPLOAD_CONTRACHEQUE_DIVIDIDO;
const NOTICIA_IMAGES_DIRECTORY = process.env.LOCAL_UPLOAD_IMAGEM_NOTICIA;

module.exports = {
	//TODO test this out
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
		req.pipe(req.busboy);
		var date = 0;
		var resolve = await (async () => {
			return new Promise((resolve, reject) => {
				req.busboy.on('file', function(fieldname, file, filename) {
					date = fieldname;
					console.log('Uploading: ' + filename);
					fstream = fs.createWriteStream(UPLOAD_PDF_DIRECTORY + date + '.pdf');
					file.pipe(fstream);
					fstream.on('close', function() {
						resolve({ sucess: true, filename: date + '.pdf' });
					});
					fstream.on('error', function(err) {
						console.log('teste' + err);
						reject({ sucess: false, error: err });
					});
				});
			});
		})();
		if (resolve.sucess) {
		    res.status(200).send({ success: true});
			await pdfHandler.pdfLoader(res, date, UPLOAD_PDF_DIRECTORY + resolve.filename, GENERATED_PDF_DIRECTORY);
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
				req.busboy.on('file', function(fieldname, file, filename) {
					console.log('Uploading: ' + filename);
					fstream = fs.createWriteStream(NOTICIA_IMAGES_DIRECTORY + filename);
					file.pipe(fstream);
					fstream.on('close', function() {
						resolve({ sucess: true, filename: filename });
					});
					fstream.on('error', function(err) {
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
