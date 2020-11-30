const NOTICIA_IMAGES_DIRECTORY =
  "/home/nicoedu/Documents/BBC/files/images/noticia/";

function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
  //extra html you want to store.
  return (
    `<div onclick="gotoNoticia(${idnoticia})" class="card col-md-3   noticia-card padding-card-responsive card-responsive"><div class="row" id="row-noticia" ><h2 class="card-title ">${titulo}</h2><div class="col-4 post-img"></div><div class="col-8 id="card-div" card-body">          <img id="card-image"  src=${NOTICIA_IMAGES_DIRECTORY}${imgsrc}" alt="Card image cap" />                  </div>    </div>    <div id="card-footer" class="card-footer text-muted">        Postado ${timestampToDate(date)}  <br><br> <button onclick="gotoNoticia(${idnoticia})" + 
     class="btn btn-blue-inline ">Ler mais &rarr;</button>    </div></div>`
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
  xhr.onload = function() {
    noticias = JSON.parse(this.responseText);
    noticias = noticias.noticias;
    noticiasElement.innerHTML = "";
    noticias.map(
      ({
        idnoticia,
        imagem_endereco,
        postado_em,
        texto,
        titulo
      }) => {
        noticiasElement.innerHTML += postStructure(
          idnoticia,
          imagem_endereco,
          titulo,
          texto,
          postado_em,
        );
      }
    );
  };
  xhr.onerror = function(event) {
    console.log(event);
  };
  xhr.send();
}

function gotoNoticia(id) {
  window.location = "./noticiaPage.html?id=" + id;
}

$(function() {
  $("#searchButton").on("click", () => {
    var searchInput = document.getElementById("searchInput");
    searchURL = "/search/" + searchInput.value;
    putPost(searchURL);
  });
  putPost();
});
