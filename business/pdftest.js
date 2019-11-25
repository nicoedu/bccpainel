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

function getItensSalario(arrayItens) {
    console.log(arrayItens);
}

function getDadosFuncionario(arrayDados) {
    console.log(arrayDados);
}

function getData() {}

function getValoresTotal() {}

function pageTextHandler(pageNum, PDFDocumentInstance) {
    // Retorna uma promessa quando a página foi extraida com sucesso
    return new Promise(function(resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function(pdfPage) {
            // Pega o texto de toda a página e salva na variável textContent
            pdfPage.getTextContent().then(function(textContent) {
                var textItems = textContent.items;

                lista = [];
                templist = [null, null, null, null, null];
                actualHeight = 9999;
                step = 0;
                console.log(textItems);
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];
                    if (step == 0 || step == 1) {
                        actualHeight = item.transform[5];
                        templist[step] = item.str;
                        step++;
                        continue;
                    } else {
                        if (actualHeight > item.transform[5]) {
                            lista.push(templist);
                            if (!isNaN(item.str)) {
                                step = 1;
                                templist = [item.str, null, null, null, null];
                                continue;
                            } else {}
                        }
                        position = Math.round(item.width + item.transform[4]);
                        if (position < 400) {
                            templist[2] = item.str;
                        } else if (position > 500) {
                            templist[4] = item.str;
                        } else {
                            templist[3] = item.str;
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
        self.pageTextHandler(1, PDFDocumentInstance).then(lista => {
            console.log(lista);
        });
    },
    function(reason) {
        //
        console.error(reason);
    }
);