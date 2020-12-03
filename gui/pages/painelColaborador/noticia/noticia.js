

function postStructure(idnoticia, imgsrc, titulo, date) {
  //extra html you want to store.
  return (
    `<div onclick="gotoNoticia(${idnoticia})" class="card col-md-5 noticia-card card-responsive"><h5 class="card-title">${titulo}</h5><div class="row card-content"><div class="post-img"><img src="https://painel.bbcvigilancia.com.br/api/image/?filename=${imgsrc}" alt="Card image cap" /></div></div><div class="card-body">                     <button onclick="gotoNoticia(${idnoticia})" class="btn btn-blue-inline">Ler mais &rarr;</button>    </div>     <div class="card-footer text-muted">        Postado ${timestampToDate(date)}    </div></div>`
  );
}

function timestampToDate(timestamp) {
  var date = new Date(+timestamp);
  var formatedTime = date.toLocaleString("pt-BR", { dateStyle: "full" });
  return formatedTime;
}

function putPost(optional = "") {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://painel.bbcvigilancia.com.br/api/noticias" + optional,
    true
  );
  xhr.setRequestHeader("auth-token", sessionStorage.getItem("token"));
  var noticiasElement = document.getElementById("noticia");
  xhr.onload = function () {
    noticias = JSON.parse(this.responseText);
    noticias = noticias.noticias;
    noticiasElement.innerHTML = "";
    noticias.map(
      ({
        idnoticia,
        imagem_endereco,
        postado_em,
        titulo
      }) => {
        noticiasElement.innerHTML += postStructure(
          idnoticia,
          imagem_endereco,
          titulo,
          postado_em,
        );
      }
    );
  };
  xhr.onerror = function (event) {
    console.log(event);
  };
  xhr.send();
}

function gotoNoticia(id) {
  window.location = "./noticiaPage.html?id=" + id;
}

$(function () {
  $("#searchButton").on("click", () => {
    var searchInput = document.getElementById("searchInput");
    searchURL = "/search/" + searchInput.value;
    putPost(searchURL);
  });
  putPost();
});
