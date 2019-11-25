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
                console.log(textItems);
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];
                    if (step == 0 || step == 1) {
                        actualHeight = item.transform[5]
                        templist[step] = item.str;
                        step++;
                        continue;
                    } else {
                        console.log(actualHeight);
                        console.log(item.transform[5])
                        if (actualHeight > item.transform[5]) {
                            lista.push(templist);
                            if (!isNaN(item.str)) {
                                step = 1;
                                templist = [item.str, null, null, null, null];
                                continue;
                            } else {

                            }

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
                resolve(lista);
            });
        });
    });
}

/**
 * Extract the test from the PDF
 */

pdfjsLib.workerSrc = 'build/pdf.worker.js';
var PDF_URL = 'contra.pdf';
pdfjsLib.getDocument(PDF_URL).then(function(PDFDocumentInstance) {
    self.getPageText(1, PDFDocumentInstance).then((lista) => {
        console.log(lista)

    });

}, function(reason) { //
    console.error(reason);
});