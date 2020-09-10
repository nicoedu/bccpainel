const pdfjsLib = require("pdfjs-dist");
const pdfDataController = require("../controller/pdfDataController");
pdfjsLib.workerSrc = "build/pdf.worker.js";

const pdfLoader = async (res, date, pdf_url, folder_url) => {
  var pdf = null;
  try {
    pdf = await pdfjsLib.getDocument(pdf_url).promise;
  } catch (error) {
    console.log(error);
  }
  if (!pdf) return;
  pagesPromises = [];
  filesPromises = [];
  insertPromisses = [];
  console.log("iniciando extração do pdf, total de páginas: " + pdf.numPages);
  for (var i = 1; i < pdf.numPages + 1; i++) {
    pagesPromises.push(pageTextHandler(i, pdf, date));
  }
  Promise.all(pagesPromises)
    .then(async pageData => {
      console.log(
        "Extração realizada com sucesso, iniciando inserção no banco de dados"
      );
      const { spawn } = require("child_process");
      console.log(date, pdf_url, folder_url);
      let pythonProcess = spawn(
        "python",
        [process.env.PYTHON_SCRIPT_LOCAL, date, pdf_url, folder_url]
        // {
        // //   detached: true
        // }
      );
      pythonProcess.stdout.on("data", chunk => {
        var textChunk = chunk.toString("utf8");
        console.log(`stdout: ${textChunk}`);
      });
      //   pythonProcess.unref();
      pageData.map(({ employee, departament, date, page }) => {
        let filename = page.toString() + "-" + date.toString() + ".pdf";
        let contracheque = {
          cpf: employee.cpf,
          data_referencia: date,
          arquivo_endereco: filename
        };

        insertPromisses.push(
          pdfDataController.insertIntoDatabase(
            employee,
            departament,
            contracheque
          )
        );
      });

      Promise.all(insertPromisses)
        .then(res.status(200).send("ok"))
        .catch(err => err);
    })
    .catch(err => err);
};

function pageTextHandler(pageNum, PDFDocumentInstance, dateUser) {
  // Retorna uma promessa quando a página foi extraida com sucesso
  return new Promise(function(resolve, reject) {
    PDFDocumentInstance.getPage(pageNum)
      .then(function(pdfPage) {
        // Pega o texto de toda a página e salva na variável textContent
        pdfPage
          .getTextContent()
          .then(function(textContent) {
            var textItems = textContent.items;

            //variavel que aguarda o momento em que os dados relevantes apareçam
            isRelevant = false;

            let employeeAndDpt = {};
            let date = dateUser;

            //Variável temporária para salvar um indice
            let indiceTemp = -1;

            //Regex para formato de data (mes escrito)/(ano de 4 digits)
            for (var index = 0; index < textItems.length; index++) {
              if (isRelevant) {
                if (indiceTemp < 0) {
                  if (!isNaN(textItems[index].str)) {
                    indiceTemp = index;
                    continue;
                  } else {
                    continue;
                  }
                } else {
                  if (textItems[index].str.startsWith("Admiss")) {
                    employeeAndDpt = getEmployeeAndDepartamentData(
                      textItems.slice(indiceTemp, index)
                    );
                    resolve({
                      employee: employeeAndDpt.empregado,
                      departament: employeeAndDpt.departamento,
                      date: date,
                      page: pageNum - 1
                    });
                    break;
                  }
                }
              }
              if (textItems[index].height > 10) {
                isRelevant = true;
                continue;
              }
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }).catch(err => {
    console.log(err);
  });
}

function getEmployeeAndDepartamentData(arrayDados) {
  var empregado = {};
  var departamento = {};
  //Retirar dados não relacionados ao funcionário
  arrayDados = arrayDados.filter(data => data.height < 8).map(data => data.str);
  empregado.matricula = arrayDados[0];
  empregado.nome = arrayDados[1];
  empregado.cargo = arrayDados[2];
  empregado.cpf = arrayDados[4]
    .split(" ")[1]
    .replace(/\./g, "")
    .replace("-", "");

  departamentoData = arrayDados[5].split(" ");
  empregado.departamento = departamentoData[1];

  departamento.id = departamentoData[1];
  departamento.nome = departamentoData.slice(3).join(" ");
  return { empregado, departamento };
}

function getDate(dateString) {
  var date = toTimestamp(
    dateString.split(" ").filter(value => value.length > 0)[1]
  );
  return date;
}

function toTimestamp(dateStr) {
  var parts = dateStr.split("/");
  var date = new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
  return date.getTime() / 1000;
}

exports.pdfLoader = pdfLoader;
