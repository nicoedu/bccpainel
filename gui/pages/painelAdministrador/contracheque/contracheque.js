+jQuery(function($) {
  "use strict";

  // UPLOAD CLASS DEFINITION
  // ======================

  var dropZone = document.getElementById("drop-zone");
  var uploadPDF = document.getElementById("uploadPDF");
  var progressBar = document.getElementById("progressBar");
  var dropText = document.getElementById("dropText");
  var uploadStatus = document.getElementById("uploadStatus");

  dropZone.addEventListener("click", function(e) {
    self.procuraArquivoExplorador();
  });

  uploadPDF.addEventListener("change", function(e) {
    e.preventDefault();
    dropZone.className = "isUploading";
    progressBar.className = "progressArea";
    var uploadFiles = document.getElementById("uploadPDF").files;
    self.startUpload(uploadFiles);
    return false;
  });

  dropZone.ondrop = function(e) {
    e.preventDefault();
    uploadStatus.innerHTML = "O arquivo está sendo enviado. Aguarde...";
    this.className = "isUploading";
    progressBar.className = "progressArea";

    self.startUpload(e.dataTransfer.files);
  };

  dropZone.ondragover = function() {
    this.className = "upload-drop-zone drop";
    dropText.innerHTML = "Solte para inserir o arquivo";

    return false;
  };

  dropZone.ondragleave = function() {
    this.className = "upload-drop-zone";
    dropText.innerHTML = "Clique ou arraste para inserir o arquivo";
    return false;
  };
});

function startUpload(files) {
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    formData.append(files[i].name, files[i]);
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3333/upload", true);

  var progressBar = document.querySelector(".progress-bar");
  var uploadStatus = document.getElementById("uploadStatus");
  uploadStatus.innerHTML = "O arquivo está sendo enviado. Aguarde...";

  xhr.upload.onprogress = function(e) {
    console.log(e.loaded, e.total);
    if (e.lengthComputable) {
      var percentage = (e.loaded / e.total) * 100;
      progressBar.setAttribute("style", "width: " + percentage + "%");
      if (percentage == 100) {
        progressBar.classList = "progress-bar bg-success";
        uploadStatus.setAttribute("style", "color: #28a745");
        uploadStatus.innerHTML = "Envio finalizado com sucesso!";
      }
    }
  };
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.onload = function(event) {
    console.log(this.statusText);
  };
  xhr.onerror = function(event) {
    progressBar.classList = "progress-bar bg-danger";
    uploadStatus.setAttribute("style", "color: #dc3545");
    uploadStatus.innerHTML = "Falha ao enviar arquivo!";
  };
  xhr.send(formData);
  return false;
}

function procuraArquivoExplorador() {
  $("#uploadPDF").trigger("click");
}
