function sendNoticia() {
  var formData = new FormData();
  var imagem_endereco = new Date().getTime().toString();
  var imagem = document.getElementById("imagem").files[0];
  formData.append(imagem_endereco, imagem);

  var titulo = document.getElementById("titulo").value;
  var texto = document.getElementById("texto").value;
  var departamento = $("#multiselect").val();
  var postado_por = sessionStorage.getItem("cpf");
  departamento.length == 0 || departamento == "null"
    ? (departamento = null)
    : (departamento = JSON.stringify(departamento));

  var noticiaObject = {
    titulo,
    texto,
    imagem_endereco,
    postado_por,
    departamento
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3333/image", true);
  xhr.onload = function(event) {
    response = JSON.parse(event.target.response);
    noticiaObject.imagem_endereco = response.filename;
    let xhr2 = new XMLHttpRequest();
    xhr2.open("POST", "http://localhost:3333/noticia", true);
    xhr2.setRequestHeader("Content-type", "application/json");
    xhr2.onload = function(event) {
      window.location = "./noticia.html";
    };
    xhr2.send(JSON.stringify(noticiaObject));
  };
  xhr.onerror = function(event) {
    console.log(event);
    callback(false, event);
  };
  xhr.send(formData);
}

function putOptions(departamentos, departamento) {
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

function previewImage() {
  var preview = document.getElementById("preview");
  var file = document.getElementById("imagem").files[0];
  var reader = new FileReader();

  reader.onloadend = function() {
    preview.src = reader.result;
  };

  if (file) {
    preview.style = "display: block;";
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

$(function() {
  getListaDepartamento((sucess, response) => {
    if (sucess) {
      var departamentos = document.getElementById("multiselect");
      JSON.parse(response).map(departamento => {
        putOptions(departamentos, departamento);
      });
      departamentos.classList = "selectpicker";
      $(".selectpicker").selectpicker();
    }
  });

  $("#submitNovaNoticia").on("click", () => {
    sendNoticia();
  });
});
