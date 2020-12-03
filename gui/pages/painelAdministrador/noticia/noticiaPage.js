function timestampToDate(timestamp) {
  var date = new Date(+timestamp);
  var dia = date.getDate();
  var mes = date.getMonth(); //Be careful! January is 0 not 1
  var ano = date.getFullYear();
  var hora = date.getHours();
  var minuto = "0" + date.getMinutes();
  var formatedTime =
    dia + "/" + mes + "/" + ano + " ás " + hora + ":" + minuto.substr(-2);
  return formatedTime;
}

function getNoticiaPorId(id) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://painel.bbcvigilancia.com.br/api/noticia?id=" + id,
    true
  );
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
  xhr.onload = function () {
    var noticia = JSON.parse(this.responseText)[0];
    var titulo = document.getElementById("titulo");
    var texto = document.getElementById("texto");
    var postado_em = document.getElementById("postado_em");
    var imagem = document.getElementById("imagem");
    imagem.src =
      "https://painel.bbcvigilancia.com.br/api/image?filename=" +
      noticia.imagem_endereco;
    titulo.innerHTML = noticia.titulo;
    texto.innerHTML = noticia.texto;
    postado_em.innerHTML += timestampToDate(noticia.postado_em);
  };
  xhr.onerror = function (event) {
    console.log(event);
  };
  xhr.send();
}

function deleteNotinia(id) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "DELETE",
    "https://painel.bbcvigilancia.com.br/api/noticia?id=" + id,
    true
  );
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () { window.location = "./index.html"; };
  xhr.onerror = function (event) {
    alert("Falha ao remover notícia, tente novamente em alguns segundos.");
    console.log(event);
  };
  xhr.send(
  )
}

$(function () {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id").toString();
  getNoticiaPorId(id);
  $("#deleteNoticia").on("click", () => {
    deleteNotinia(id)
  });
});
