/*

Formato Lab02:
    - Duplicata de recibo
    6 Areas:
        1. dado da empresa / mes de pagamento
        2. dados do funcionário
        3. itens de calculo do salário
        4. totals e valor liquido
        5. Salário base, bases de calculo de impostos e FTGS do mês
        6. Aréa de assinatura do funcionário

Formatação PDF.js: // Array contendo cada string da página pdf separada, muitos dos arrays contém rótulos e outros textos que não valem ser extraídos

*Template: (Indice). area do lab02
*    - Inicio de dados úteis
*    - Fim de dados úteis

    1. Area 3
        - Indicio do array
        - "Recibo de Pagamento de Salário" (Unico com height 11)
    2. Area 6 e Rótulos das outras áreas
        - "Recibo de Pagamento de Salário" (Unico com height 11)
        - Primeiro inteiro
    3. Area 2 / aréa 1 (será ignorado os dados da empresa da área 1)
        - Primeiro inteiro
        - Valores floats dos totais
    4. Area 4
        - contém 3 dados ordenados:
            (a)Total de vencimentos
            (b)Total de descontos
            (c)Valor liquido
        - fim dos 3 dados
    5. Area 5
        - Contém 5 dados ordenados:
            (a) Base calc IRRF
            (b) FGTS do mes
            (c) Base Calc. FGTS
            (d) Base calc. previdência
            (e) sálario base
        - fim dos 5 dados
    6. CNPJ seguido de duplicação do contracheque

!!Extração de dados do pdf

Etapas de extração:
1.Itens que compôe o salário [3]
    (a) Partir array de 0 até valor de heigh 11
2.Dados do funcionário
    (a) Busca um valor numérico
    (b) Partir array de (a) até Admissão
3.Data
    (a) Unico item
4.Valores totais
    (a) Busca valor financeiro
    (b) Partir array em 3 valores
5.impostos, base de cálculo de impostos e salário base
    (a) contínuo após 4
    (b) Partir array em 5 valores
6.Ignorar o resto da página por motivo de duplicação (Lab02 contém uma via duplicada para o funcionário)
*/

import {
  ItensSalarioModel,
  FuncionarioDadosModel,
  ValorTotalModel,
  BaseCalculoModel,
  ContrachequeModel
} from "./model/modelExport.js";

function getSalaryComposition(arrayItens) {
  var listSalaryItem = [];
  var item = null;
  var position = 0;
  for (var index = 0; index < arrayItens.length; index++) {
    var data = arrayItens[index];
    //Checa se valor é um numero
    if (!isNaN(data.str)) {
      //Ignora a primeira interação
      item == null ? null : listSalaryItem.push(item.toJSON());
      //Declara novo objeto de modelo
      item = new ItensSalarioModel(data.str);
    } else {
      //Checa se é descrição
      if (data.transform[4] < 100) {
        item.descricao = data.str;
      } else {
        position = Math.round(data.width + data.transform[4]);
        //Checa se é referencia
        if (position < 400) {
          item.referencia = data.str;
        }
        //Checa se é desconto
        else if (position > 500) {
          item.descontos = data.str;
        }
        //Senão é vencimento
        else {
          item.vencimentos = data.str;
        }
      }
    }
  }
  //Adiciona ultimo item lido ao array
  listSalaryItem.push(item.toJSON());
  console.log(listSalaryItem);
}

function toTimestamp(dateStr) {
  var parts = dateStr.split("/");
  var date = new Date(parts[2], parts[1] - 1, parts[0]);
  return date.getTime() / 1000;
}

function getEmployeeData(arrayDados) {
  var empregado = new FuncionarioDadosModel();
  //Retirar dados não relacionados ao funcionário
  arrayDados = arrayDados.filter(data => data.height < 8).map(data => data.str);
  empregado.matricula = arrayDados[0];
  empregado.nome = arrayDados[1];
  empregado.cargo = arrayDados[2];
  empregado.cbo = arrayDados[3];
  empregado.banco = arrayDados[6];
  empregado.cpf = arrayDados[4]
    .split(" ")[1]
    .replace(/\./g, "")
    .replace("-", "");
  empregado.departamento = arrayDados[5].split(" ")[1];
  empregado.admissao = toTimestamp(arrayDados[7].split(" ")[1]);
  console.log(empregado.toJSON());
}

function getDate(dateString) {
  var data = toTimestamp(
    dateString.split(" ").filter(value => value.length > 0)[1]
  );
  console.log(data);
}

function getTotalSalaryValues(arrayValues) {
  arrayValues = arrayValues.map(data => data.str);
  var total = new ValorTotalModel();
  total.vencimentos = arrayValues[0];
  total.descontos = arrayValues[1];
  total.liquido = arrayValues[2];
  console.log(total.toJSON());
}

function getSalaryBasesCalc(arrayValues) {
  arrayValues = arrayValues.map(data => data.str);
  var base = new BaseCalculoModel();
  base.baseCalcIRRF = arrayValues[0];
  base.fgts = arrayValues[1];
  base.basecalcFGTS = arrayValues[2];
  base.baseCalcPrevidencia = arrayValues[3];
  base.salarioBase = arrayValues[4];
  console.log(base.toJSON());
}

function pageTextHandler(pageNum, PDFDocumentInstance) {
  // Retorna uma promessa quando a página foi extraida com sucesso
  return new Promise(function(resolve, reject) {
    PDFDocumentInstance.getPage(pageNum).then(function(pdfPage) {
      // Pega o texto de toda a página e salva na variável textContent
      pdfPage.getTextContent().then(function(textContent) {
        var textItems = textContent.items;
        //Variável para monitorar a etapa da extração
        var stepExtraction = 1;
        //Variável temporária para salvar um indice de inicio
        var indiceTemp = -1;
        //Variável booleana temporária para alertar leitura de x indices
        var flagTemp = false;
        //Regex para formato de data (mes escrito)/(ano de 4 digits)
        let regexDate = new RegExp("([A-Za-z])+/[0-9]{4}");
        //Regex para formato de valor monetário $$,$$ ou $.$$$,$$
        let regexMonetary = new RegExp("[0-9]+(.[0-9]*)*(,[0-9]{2})");
        for (var index = 0; index < textItems.length; index++) {
          switch (stepExtraction) {
            case 1: {
              if (textItems[index].height == 11) {
                getSalaryComposition(textItems.slice(0, index));
                stepExtraction += 1;
                continue;
              } else {
                continue;
              }
            }
            case 2: {
              if (!flagTemp) {
                if (!isNaN(textItems[index].str)) {
                  indiceTemp = index;
                  flagTemp = true;
                  continue;
                } else {
                  continue;
                }
              } else {
                //Verifica se valor da string é Admissão e inclui este dado no corte [i+1]
                if (textItems[index].str.startsWith("Admiss")) {
                  getEmployeeData(textItems.slice(indiceTemp, index + 1));
                  stepExtraction += 1;
                  indiceTemp = -1;
                  flagTemp = false;
                  continue;
                } else {
                  continue;
                }
              }
            }
            case 3: {
              if (textItems[index].str.match(regexDate)) {
                getDate(textItems[index].str);
                stepExtraction += 1;
                continue;
              } else {
                continue;
              }
            }
            case 4: {
              if (!flagTemp) {
                if (textItems[index].str.match(regexMonetary)) {
                  indiceTemp = index;
                  flagTemp = true;
                  continue;
                } else {
                  continue;
                }
              } else {
                if (index - indiceTemp == 2) {
                  getTotalSalaryValues(textItems.slice(indiceTemp, index + 1));
                  stepExtraction += 1;
                  indiceTemp = -1;
                  flagTemp = false;
                  continue;
                }
              }
            }
            case 5: {
              if (!flagTemp) {
                if (textItems[index].str.match(regexMonetary)) {
                  indiceTemp = index;
                  flagTemp = true;
                  continue;
                } else {
                  continue;
                }
              } else {
                if (index - indiceTemp == 4) {
                  getSalaryBasesCalc(textItems.slice(indiceTemp, index + 1));
                  stepExtraction += 1;
                  indiceTemp = -1;
                  flagTemp = false;
                  continue;
                }
              }
            }
            default: {
              break;
            }
          }
        }

        // Solve promise with the text retrieven from the page
        resolve(true);
      });
    });
  });
}

/**
 * Extract the test from the PDF
 */

pdfjsLib.workerSrc = "build/pdf.worker.js";
var PDF_URL = "contra.pdf";
pdfjsLib.getDocument(PDF_URL).then(
  function(PDFDocumentInstance) {
    pageTextHandler(1, PDFDocumentInstance).then(lista => {
      console.log(lista);
    });
  },
  function(reason) {
    //
    console.error(reason);
  }
);
