+jQuery(function($) {
  "use strict";

  // UPLOAD CLASS DEFINITION
  // ======================

  var dropZone = document.getElementById("drop-zone");
  var uploadPDF = document.getElementById("uploadPDF");
  var progressBar = document.getElementById("progressBar");
  var dropText = document.getElementById("dropText");
  var uploadStatus = document.getElementById("uploadStatus");
  var uploadWarning = document.getElementById('uploadWarning');
  var datebutton = document.getElementById("datebutton");
  var timestamp = "";

  datebutton.addEventListener("click", function(e) {
    var selectMes = document.getElementById("selectMes");
    var selectAno = document.getElementById("selectAno");
    timestamp = selectAno.value + "-" + selectMes.value;
    dropZone.setAttribute("style", "display: flex");
  });

  dropZone.addEventListener("click", function(e) {
    self.procuraArquivoExplorador();
  });

  uploadPDF.addEventListener("change", function(e) {
    e.preventDefault();
    dropZone.className = "isUploading";
    progressBar.className = "progressArea";
    var uploadFiles = document.getElementById("uploadPDF").files;
    self.startUpload(timestamp, uploadFiles);
    return false;
  });

  dropZone.ondrop = function(e) {
    e.preventDefault();
    uploadStatus.innerHTML = "O arquivo está sendo enviado. Aguarde...";
    this.className = "isUploading";
    progressBar.className = "progressArea";

    self.startUpload(timestamp, e.dataTransfer.files);
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

function dateToTimestamp(ano, mes) {
  var date = new Date(Date.UTC(ano, mes));
  return date.getTime() / 1000;
}

function startUpload(timestamp, files) {
  var formData = new FormData();
  var progressBar = document.querySelector(".progress-bar");
  var uploadStatus = document.getElementById("uploadStatus");
  for (var i = 0; i < files.length; i++) {
    if (files[i].type != "application/pdf") {
      progressBar.classList = "progress-bar bg-danger";
      progressBar.setAttribute("style", "width: 100%");
      uploadStatus.setAttribute("style", "color: #dc3545");
      uploadStatus.innerHTML = "Formato de arquivo inválido!";
      return;
    }
    formData.append(timestamp.toString(), files[i]);
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://painel.bbcvigilancia.com.br/api/upload", true);
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));

  uploadStatus.innerHTML = "O arquivo está sendo enviado. Aguarde...";

  xhr.upload.onprogress = function(e) {
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
	xhr.onload = function(event) {
		uploadStatus.innerHTML = 'Contracheque cadastrado com sucesso!';
		uploadWarning.innerHTML = 'O contracheque pode levar alguns minutos para ser vizualizado pelo prestador';
		progressBar.classList = 'progress-bar bg-success';
		uploadStatus.setAttribute('style', 'color: #28a745');

		console.log(this.statusText);
	};
	xhr.onerror = function(event) {
		progressBar.classList = 'progress-bar bg-danger';
		uploadStatus.setAttribute('style', 'color: #dc3545');
		uploadStatus.innerHTML = 'Falha ao enviar arquivo!';
	};
	xhr.send(formData);
	return true;
}

function procuraArquivoExplorador() {
  $("#uploadPDF").trigger("click");
}
