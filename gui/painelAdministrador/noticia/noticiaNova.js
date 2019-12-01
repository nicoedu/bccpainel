function sendNoticia() {
    var formData = new FormData();
    var imagem_endereco = new Date().getTime().toString();
    var imagem = document.getElementById("imagem").files[0];
    formData.append(imagem_endereco, imagem);

    var titulo = document.getElementById("titulo").value;
    var texto = document.getElementById("texto").value;
    var departamento = $("#departamento").val();
    var postado_por = "admin";
    departamento.length == 0 || departamento == "null" ?
        (departamento = null) :
        (departamento = JSON.stringify(departamento));

    var noticiaObject = {
        titulo,
        texto,
        imagem_endereco,
        postado_por,
        departamento
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3333/image", true);
    xhr.onload = function() {
        let xhr2 = new XMLHttpRequest();
        xhr2.open("POST", "http://localhost:3333/noticia", true);
        xhr2.setRequestHeader("Content-type", "application/json");
        xhr2.onload = function(event) {
            console.log(event);
        };
        xhr2.send(JSON.stringify(noticiaObject));
    };
    xhr.onerror = function(event) {
        console.log(event);
        callback(false, event);
    };
    xhr.send(formData);
}

function putOptions(departamento) {
    var departamentos = document.getElementById("departamento");
    departamentos.innerHTML +=
        '<option value="' +
        departamento.iddepartamento +
        '">' +
        departamento.nomedepartamento +
        "</option>";
}

function getListaDepartamento(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3333/departamentos", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            callback(true, xhr.responseText);
        }
    };
    xhr.onerror = function(event) {
        console.log(event);
        callback(false, event);
    };
    xhr.send();
}

$(function() {
    console.log("jquery");
    getListaDepartamento((sucess, response) => {
        if (sucess) {
            JSON.parse(response).map(departamento => {
                putOptions(departamento);
            });
        }
    });

    $("#submitNovaNoticia").on("click", () => {
        sendNoticia();
    });
});