function sendNoticia() {
  var formData = new FormData();
  try {
    var file = document.getElementById("imagem").files[0];
    extension = file.name.substr(file.name.lastIndexOf("."));
    var imagem_endereco = new Date().getTime().toString() + extension;
    formData.append("file", file, imagem_endereco);
  } catch (event) {
    var imagem_endereco = null;
  }

  var titulo = document.getElementById("titulo").value;
  var texto = document.getElementById("texto").value;
  var departamento = $("#multiselect").val();
  var postado_por = sessionStorage.getItem("cpf");
  let checks = 0;
  departamento.length == 0 || !departamento
    ? (departamento = null)
    : (departamento = JSON.stringify(departamento));

  var noticiaObject = {
    titulo,
    texto,
    imagem_endereco,
    postado_por,
    departamento
  };
  if (imagem_endereco != null) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://painel.bbcvigilancia.com.br/api/image", true);
    xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
    xhr.onload = function(event) {
      checks += 1;
      goToNoticiaPage(checks);
    };
    xhr.onerror = function(event) {
      console.log(event);
    };
    xhr.send(formData);
  }
  let xhr2 = new XMLHttpRequest();
  xhr2.open("POST", "https://painel.bbcvigilancia.com.br/api/noticia", true);
  xhr2.setRequestHeader("Content-type", "application/json");
  xhr2.setRequestHeader("auth-token", sessionStorage.getItem("token"));
  xhr2.onload = function(event) {
    checks += 1;
    goToNoticiaPage(checks);
  };
  xhr2.onerror = function(event) {
    console.log("error");
  };

  xhr2.send(JSON.stringify(noticiaObject));
}

function goToNoticiaPage(checks) {
  if (!imagem_endereco && checks < 2) {
    return false;
  }
  window.location = "./index.html";
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
  xhr.open(
    "GET",
    "https://painel.bbcvigilancia.com.br/api/departamentos",
    true
  );
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
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
