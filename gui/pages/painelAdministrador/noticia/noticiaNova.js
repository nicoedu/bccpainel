function sendImage() {
  var formData = new FormData();
  try {
    var file = document.getElementById("imagem").files[0];
    extension = file.name.substr(file.name.lastIndexOf("."));
    var imagem_endereco = new Date().getTime().toString() + extension;
    formData.append("file", file, imagem_endereco);
  } catch (event) {
    var imagem_endereco = null;
  }

  if (imagem_endereco != null) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://painel.bbcvigilancia.com.br/api/image", true);
    xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
    xhr.onload = function(event) {
      sendNoticia(imagem_endereco);
    };
    xhr.onerror = function(event) {
      console.log(event);
    };
    xhr.send(formData);
  }else{
    sendNoticia(null);
  }
 
}

function sendNoticia(imagem_endereco = null) {
  var titulo = document.getElementById("titulo").value;
  var texto = document.getElementById("texto").value;
  let checks = 0;
  

  var noticiaObject = {
    titulo,
    texto,
    imagem_endereco,
  };

  let xhr2 = new XMLHttpRequest();
  xhr2.open("POST", "https://painel.bbcvigilancia.com.br/api/noticia", true);
  xhr2.setRequestHeader("Content-type", "application/json");
  xhr2.setRequestHeader("auth-token", sessionStorage.getItem("token"));
  xhr2.onload = function(event) {
    goToNoticiaPage();
  };
  xhr2.onerror = function(event) {
    console.log("error");
  };

  xhr2.send(JSON.stringify(noticiaObject));
}

function goToNoticiaPage() {

  window.location = "./index.html";
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


  $("#submitNovaNoticia").on("click", () => {
    sendImage();
  });
});
