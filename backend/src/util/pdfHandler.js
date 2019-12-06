const pdfjsLib = require("pdfjs-dist");
const hummus = require("hummus");
const pdfDataController = require("../controller/pdfDataController");
pdfjsLib.workerSrc = "build/pdf.worker.js";
// var PDF_URL = "/home/nicoedu/Documents/BBC/meu/backend/src/util/contra.pdf";
// var FOLDER_URL = "/home/nicoedu/Documents/BBC/meu/backend/src/util/output/";

const pdfLoader = async (pdf_url, folder_url) => {
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
    pagesPromises.push(pageTextHandler(i, pdf));
  }
  Promise.all(pagesPromises)
    .then(pageData => {
      console.log(
        "Extração realizada com sucesso, iniciando inserção no banco de dados"
      );
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

      var date = pageData[0].date;

      const spawn = require("child_process").spawn;
      const pythonProcess = spawn("python", [
        "/home/nicoedu/Documents/BBC/meu/backend/src/util/pdfHandler.py",
        date,
        pdf_url,
        folder_url
      ]);
      pythonProcess.stdout.on("data", function(data) {
        console.log(data.toString());
      });
      Promise.all(insertPromisses).catch(err => err);
    })
    .catch(err => err);
};

function pageTextHandler(pageNum, PDFDocumentInstance) {
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
            let date = {};

            //Variável temporária para salvar um indice
            let indiceTemp = -1;

            //Regex para formato de data (mes escrito)/(ano de 4 digits)
            let regexDate = new RegExp("([A-Za-z])+/[0-9]{4}");
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
                    continue;
                  }
                  if (textItems[index].str.match(regexDate)) {
                    date = getDate(textItems[index].str);
                    resolve({
                      employee: employeeAndDpt.empregado,
                      departament: employeeAndDpt.departamento,
                      date: date,
                      page: pageNum
                    });
                    break;
                  }
                  continue;
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

function savePdf(folder_url, pdf_url, employee, date, page) {
  return new Promise((res, rej) => {
    filename = employee.matricula.replace(/^0+/, "") + date.toString() + ".pdf";
    var pdfWriter = hummus.createWriter(folder_url + filename);
    pdfWriter.appendPDFPagesFromPDF(pdf_url, [[page - 1, page]]);
    pdfWriter.end();
    res(filename);
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
  var date = new Date(parts[2], parts[1] - 1, parts[0]);
  return date.getTime() / 1000;
}

exports.pdfLoader = pdfLoader;
