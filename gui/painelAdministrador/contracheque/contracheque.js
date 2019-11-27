+jQuery(function($) {
    "use strict";

    // UPLOAD CLASS DEFINITION
    // ======================

    var dropZone = document.getElementById("drop-zone");
    var uploadPDF = document.getElementById("uploadPDF");
    var uploadForm = document.getElementById("uploadForm");

    dropZone.addEventListener("click", function(e) {
        self.procuraArquivoExplorador();
    });

    uploadPDF.addEventListener("change", function(e) {
        e.preventDefault();
        var uploadFiles = document.getElementById("uploadPDF").files;
        var formdata = document.getElementById("uploadForm").form;
        self.startUpload(formdata, uploadFiles);
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

function startUpload(form, files) {
    var formData = new FormData(form);
    for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
    }
    for (var [key, value] of formData.entries()) {
        console.log(key, value);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3333/upload", false);
    xhr.onload = function(event) {
        console.log(xhr.responseText);
    };
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("Content-Type", "application/pdf");
    xhr.send(formData);
}

document.getElementById("uploadForm").onsubmit = function(e) {
    e.preventDefault();
    // AJAX here
    console.log("form submission intercepted");
};

function procuraArquivoExplorador() {
    $("#uploadPDF").trigger("click");
}