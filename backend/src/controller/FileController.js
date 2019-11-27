const fs = require("fs");

module.exports = {
    save_file(req, res) {
        var fstream;
        req.pipe(req.busboy);
        new Promise((resolve, reject) => {
                req.busboy.on("file", function(fieldname, file, filename) {
                    console.log("Uploading: " + filename);
                    fstream = fs.createWriteStream(
                        "/home/nicoedu/Documents/BBC/meu/backend/uploads/" + filename
                    );
                    file.pipe(fstream);
                    fstream.on("close", function() {
                        resolve(true);
                    });
                    fstream.on("error", function(err) {
                        console.log(err);
                        reject(err);
                    });
                });
            })
            .then((success, error) => {
                if (success) {
                    return res.status(200).send("top");
                } else {
                    return res.status(400).send(error);
                }
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error);
            });
    }
};