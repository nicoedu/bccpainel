
const fs = require('fs');
const User = require('../models/User');
const Contracheque = require('../models/Contracheque');

const filterTxtData = (data) => {

    // Regex para capturar o CPF
    let cpf = data.match(/[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}/)[0]
    cpf = cpf.replace(/\.|-/g, "")

    // Regex para capturar o nome
    let nome = data.substring(data.indexOf("Nome")).match(/"[A-Z ]+"/)[0];
    nome = nome.replace(/\"/g, "")

    return new User({ cpf, nome })

}

module.exports = async (date, origin_folder_url, destiny_folder_url) => {

    const txtFile = origin_folder_url + date + '.txt'
    const pdfFile = origin_folder_url + date + '.pdf'

    var readStream = fs.createReadStream(txtFile);
    var data = '';

    readStream.on('data', function (chunk) {
        data += chunk;
    }).on('end', () => {

        const list = data.split("\r");
        let userArray = []
        let contrachequeArray = []

        for (i = 0; i < list.length; i += 2) {
            const user = filterTxtData(list[i])
            userArray.push(user)

            contrachequeArray.push({
                cpf: user.cpf,
                data_referencia: date,
                arquivo_endereco: (i / 2) + '-' + date + '.pdf'
            })
        }
        User.bulkCreateUser(userArray, (err, res) => {
            if (err && err.errno != 1062) console.log(err)

            Contracheque.bulkCreateContracheque(contrachequeArray, (err, res) => {
                if (err && err.errno != 1062) console.log(err)

                const { spawn } = require('child_process');
                let pythonProcess = spawn('python', [process.env.PYTHON_SCRIPT_LOCAL, date, pdfFile, destiny_folder_url], {
                    detached: true,
                    stdio: 'ignore'
                });
                pythonProcess.unref();
            })

        });
    });

};