+ function($) {
    'use strict';

    // UPLOAD CLASS DEFINITION
    // ======================

    var dropZone = document.getElementById('drop-zone');

    dropZone.addEventListener('click', function(e) {
        self.procuraArquivoExplorador()
    })

    uploadForm.addEventListener('submit', function(e) {
        var uploadFiles = document.getElementById('uploadPDF').files;
        e.preventDefault()

        startUpload(uploadFiles)
    })

    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';

        startUpload(e.dataTransfer.files)
    }

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    }

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    }

}(jQuery);

function procuraArquivoExplorador() {
    $('#uploadPDF').trigger('click');
}