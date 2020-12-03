+jQuery(function ($) {
  "use strict";

  // UPLOAD CLASS DEFINITION
  // ======================

  var dropZonePDF = document.getElementById("drop-zone-PDF");
  var dropZoneTXT = document.getElementById("drop-zone-TXT");
  var uploadPDF = document.getElementById("uploadPDF");
  var uploadTXT = document.getElementById("uploadTXT");
  var progressBar = document.getElementById("progressBar");
  var dropTextPDF = document.getElementById("dropText");
  var dropTextTXT = document.getElementById("dropText2");
  var iconPDF = document.getElementById("icon-PDF");
  var iconTXT = document.getElementById("icon-TXT");
  var datebutton = document.getElementById("datebutton");
  var timestamp = "";
  var files = { pdf: false, txt: false };
  var formData = new FormData();

  datebutton.addEventListener("click", function (e) {
    var selectMes = document.getElementById("selectMes");
    var selectAno = document.getElementById("selectAno");
    timestamp = selectAno.value + "-" + selectMes.value;
    dropZonePDF.setAttribute("style", "display: flex");
    dropZoneTXT.setAttribute("style", "display: flex");
  });

  dropZonePDF.addEventListener("click", function (e) {
    self.procuraArquivoExplorador(true);
  });
  dropZoneTXT.addEventListener("click", function (e) {
    self.procuraArquivoExplorador(false);
  });

  uploadPDF.addEventListener("change", function (e) {
    e.preventDefault();
    var uploadFiles = document.getElementById("uploadPDF").files;
    checkUpload(uploadFiles, "application/pdf", true)
    return false;
  });

  uploadTXT.addEventListener("change", function (e) {
    e.preventDefault();
    var uploadFiles = document.getElementById("uploadTXT").files;
    checkUpload(uploadFiles, "text/plain", false)
    return false;
  });

  dropZonePDF.ondrop = function (e) {
    e.preventDefault();
    checkUpload(e.dataTransfer.files, "application/pdf", true)
  };

  dropZonePDF.ondragover = function () {
    this.className = "upload-drop-zone drop";
    dropTextPDF.innerHTML = "Solte para inserir o arquivo";

    return false;
  };

  dropZonePDF.ondragleave = function () {
    this.className = "upload-drop-zone";
    dropTextPDF.innerHTML = "Clique ou arraste para inserir o arquivo";
    return false;
  };

  dropZoneTXT.ondrop = function (e) {
    e.preventDefault();
    console.log(e.dataTransfer.files)
    checkUpload(e.dataTransfer.files, "text/plain", false)
  };

  dropZoneTXT.ondragover = function () {
    this.className = "upload-drop-zone drop";
    dropTextTXT.innerHTML = "Solte para inserir o arquivo";

    return false;
  };

  dropZoneTXT.ondragleave = function () {
    this.className = "upload-drop-zone";
    dropTextTXT.innerHTML = "Clique ou arraste para inserir o arquivo";
    return false;
  };

  function checkUpload(uploadFiles, type, isPdf) {
    if (uploadFiles.length > 1) {
      error("Não insira multiplos arquivos!", isPdf);
      return;
    } else if (uploadFiles[0].type != type) {
      error("Formato de arquivo inválido", isPdf)
      return;
    }
    if (isPdf) {
      files.pdf = true;
      formData.append(timestamp, uploadFiles[0])
      success(true)
    } else {
      files.txt = true;
      formData.append(timestamp, uploadFiles[0])
      success(false)
    }
    if (files.txt && files.pdf) {
      dropZonePDF.className = "isUploading";
      dropZoneTXT.className = "isUploading";
      progressBar.className = "progressArea";
      self.startUpload(formData);
    }
  }

  function error(message, isPdf) {
    if (isPdf) {
      iconPDF.className = "fas fa-times"
      iconPDF.setAttribute("style", "color: #dc3545");
      dropTextPDF.innerHTML = message
    } else {
      iconTXT.className = "fas fa-times"
      iconTXT.setAttribute("style", "color: #dc3545");
      dropTextTXT.innerHTML = message
    }

  }

  function success(isPdf) {
    if (isPdf) {
      iconPDF.className = "fas fa-check"
      iconPDF.setAttribute("style", "color: #28a745");
      dropTextPDF.innerHTML = "Aguardando segundo arquivo"
    } else {
      iconTXT.className = "fas fa-check"
      iconTXT.setAttribute("style", "color: #28a745");
      dropTextTXT.innerHTML = "Aguardando segundo arquivo"
    }

  }
});


function dateToTimestamp(ano, mes) {
  var date = new Date(Date.UTC(ano, mes));
  return date.getTime() / 1000;
}

function startUpload(formData) {
  var progressBar = document.querySelector(".progress-bar");
  var uploadStatus = document.getElementById("uploadStatus");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://painel.bbcvigilancia.com.br/api/upload", true);
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));

  uploadStatus.innerHTML = "O arquivo está sendo enviado. Aguarde...";

  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      var percentage = e.loaded / e.total * 100;
      progressBar.setAttribute('style', 'width: ' + percentage + '%');
      if (percentage == 100) {
        progressBar.classList = 'progress-bar progress-bar-striped progress-bar-animated';
        uploadStatus.innerHTML = 'Processando dados do arquivo...';
        uploadWarning.innerHTML = 'Não feche essa janela até o processo ser concluído!';
      }
    }
  };
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.onload = function (event) {
    uploadStatus.innerHTML = 'Contracheque cadastrado com sucesso!';
    uploadWarning.innerHTML = 'O contracheque pode levar alguns minutos para ser vizualizado pelo prestador';
    progressBar.classList = 'progress-bar bg-success';
    uploadStatus.setAttribute('style', 'color: #28a745');

    console.log(this.statusText);
  };
  xhr.onerror = function (event) {
    progressBar.classList = 'progress-bar bg-danger';
    uploadStatus.setAttribute('style', 'color: #dc3545');
    uploadStatus.innerHTML = 'Falha ao enviar arquivo!';
  };
  xhr.send(formData);
  return true;
}

function procuraArquivoExplorador(isPdf) {
  if (isPdf) {

    $("#uploadPDF").trigger("click");
  } else {
    $("#uploadTXT").trigger("click");
  }
}
