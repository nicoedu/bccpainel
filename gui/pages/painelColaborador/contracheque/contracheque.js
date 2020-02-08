var pdfBase64;
$(function() {
  $("#datebutton").click(() => {
    var selectMes = document.getElementById("selectMes");
    var selectAno = document.getElementById("selectAno");
    adjustedDate = selectAno.value + "-" + selectMes.value;
    getPdfFile(adjustedDate);
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

function dateToTimestamp(ano, mes) {
  var date = new Date(Date.UTC(ano, mes));
  return date.getTime() / 1000;
}

function getPdfFile(date) {
  var cpf = sessionStorage.getItem("cpf");
  var buttonDownload = document.getElementById("pdfDownload");
  var pdfArea = document.getElementById("pdfArea");
  var errorArea = document.getElementById("errorArea");
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://painel.bbcvigilancia.com.br/api/contracheque/" +
      date +
      "/?cpf=" +
      cpf
  );
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
  xhr.onload = function() {
    response = JSON.parse(this.response);
    if (response.length == 0) {
      buttonDownload.style = "display: none";
      pdfArea.style = "display: none";
      errorArea.style = "display: block";
      return;
    }
    var xhr2 = new XMLHttpRequest();
    xhr2.open(
      "GET",
      //"https://painel.bbcvigilancia.com.br/api/downloadpdf?cpf=" + cpf + "&date=" + date
      "https://painel.bbcvigilancia.com.br/api/downloadpdf?filename=" +
        response[0].arquivo_endereco
    );
    xhr2.setRequestHeader("auth-token", sessionStorage.getItem("token"));
    xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr2.onload = function() {
      pdfBase64 = this.response;
      var pdfAsArray = toPDFObj(pdfBase64);
      var loadingTask = pdfjsLib.getDocument(pdfAsArray);
      loadingTask.promise.then(
        function(pdf) {
          pdfDocument = pdf;

          buttonDownload.style = "display: block";
          pdfArea.style = "display: block";
          errorArea.style = "display: none";
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
          console.error(reason);
        }
      );
    };
    xhr2.onerror = function(event) {
      buttonDownload.style = "display: none";
      pdfArea.style = "display: none";
      errorArea.style = "display: block";
      console.log(event);
    };
    xhr2.send();
  };
  xhr.onerror = event => {
    buttonDownload.style = "display: none";
    pdfArea.style = "display: none";
    errorArea.style = "display: block";
    console.log(event);
  };
  xhr.send();
}
