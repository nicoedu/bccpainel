var pdfBase64;
$(function() {
  $("#datebutton").click(() => {
    date = $("#datebutton").val();
    //TODO aceitar datas
    adjustedDate = date;
    getPdfFile(adjustedDate);
    var buttonDownload = document.getElementById("pdfDownload");
  });

  $("#pdfDownload").click(() => {
    dataURIToBlob(pdfBase64, blob => {
      var a = document.createElement("a");
      a.download = "contracheque.pdf";
      a.innerHTML = "download";
      a.href = URL.createObjectURL(blob);
      a.click();
    });
  });
  var pdfjsLib = window["pdfjs-dist/build/pdf"];

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "../../../dist/pdfjs/build/pdf.worker.js";
});

function dataURIToBlob(data, callback) {
  var binStr = atob(data),
    len = binStr.length,
    arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  callback(new Blob([arr]));
}

function toPDFObj(base64) {
  var raw = atob(base64);
  var uint8Array = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}

function dateToTimestamp() {}

function getPdfFile(date) {
  var cpf = sessionStorage.getItem("cpf");
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    //"http://localhost:3333/downloadpdf?cpf=" + cpf + "&date=" + date
    "http://localhost:3333/downloadpdf?filename=2900-1569898800"
  );
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    pdfBase64 = this.response;
    var pdfAsArray = toPDFObj(pdfBase64);
    console.log(pdfAsArray);
    var loadingTask = pdfjsLib.getDocument(pdfAsArray);
    var pdfDocument;
    loadingTask.promise.then(
      function(pdf) {
        pdfDocument = pdf;
        console.log(typeof pdf);
        console.log("PDF loaded");

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log("Page loaded");

          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale });

          // Prepare canvas using PDF page dimensions
          var canvas = document.getElementById("the-canvas");
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            console.log("Page rendered");
          });
        });
      },
      function(reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  };
  xhr.onerror = function(event) {
    console.log(event);
  };
  xhr.send();
}
