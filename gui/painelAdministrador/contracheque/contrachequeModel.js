function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function(resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function(pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function(textContent) {
                var textItems = textContent.items;
                var finalString = "";

                // Concatenate the string of the item to the final string
                lista = [];
                templist = [null, null, null, null, null];
                actualHeight = 9999;
                step = 0;
                for (var i = 0; i < 20; i++) {
                    var item = textItems[i];
                    if (step == 0 || step == 1) {
                        actualHeight = item.transform[5]
                        templist[step] = item.str;
                        step++;
                        continue;
                    } else {
                        if (actualHeight < item.transform[5]) {
                            lista.push(templist);
                            step = 1;
                            templist = [item.str, null, null, null, null];
                            continue;
                        }
                        width = item.width;
                        position = item.transform[4];
                    }



                    if (!isNaN(item.str)) {

                    }

                    var coluna = position - width;

                    templist.push(item.str)

                }

                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}

function

/**
 * Extract the test from the PDF
 */

pdfjsLib.workerSrc = 'build/pdf.worker.js';
var PDF_URL = 'contra.pdf';
pdfjsLib.getDocument(PDF_URL).then(function(PDFDocumentInstance) {
    PDFDocumentInstance.getPage(1).then((pdfPage) => {
        pdfPage.getTextContent().then((content) => {
            console.log(content.items)

        })
    })

}, function(reason) { //
    console.error(reason);
});