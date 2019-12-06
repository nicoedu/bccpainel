+jQuery(function($) {
  "use strict";

  // UPLOAD CLASS DEFINITION
  // ======================

  var dropZone = document.getElementById("drop-zone");
  var uploadPDF = document.getElementById("uploadPDF");

  dropZone.addEventListener("click", function(e) {
    self.procuraArquivoExplorador();
  });

  uploadPDF.addEventListener("change", function(e) {
    e.preventDefault();
    var uploadFiles = document.getElementById("uploadPDF").files;
    self.startUpload(uploadFiles);
    return false;
  });

  dropZone.ondrop = function(e) {
    e.preventDefault();
    this.className = "upload-drop-zone";

    self.startUpload(e.dataTransfer.files);
  };

  dropZone.ondragover = function() {
    this.className = "upload-drop-zone drop";
    return false;
  };

  dropZone.ondragleave = function() {
    this.className = "upload-drop-zone";
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

  xhr.upload.onprogress = function(e) {
    console.log(e.loaded, e.total);
    if (e.lengthComputable) {
      var percentage = (e.loaded / e.total) * 100;
      console.log(percentage + "%");
      progressBar.setAttribute("style", "width = " + percentage + "%");
    }
  };
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.onload = function(event) {
    console.log(this.statusText);
  };
  xhr.onerror = function(event) {
    console.log(event);
  };
  xhr.send(formData);
  return false;
}

function procuraArquivoExplorador() {
  $("#uploadPDF").trigger("click");
}
