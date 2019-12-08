const NOTICIA_IMAGES_DIRECTORY =
  "/home/nicoedu/Documents/BBC/files/images/noticia/";

function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
  //extra html you want to store.
  return (
    '<div class="card col-md-5 noticia-card"><div class="row"><div class="col-4 post-img"><img src=' +
    NOTICIA_IMAGES_DIRECTORY +
    imgsrc +
    '" alt="Card image cap" /></div><div class="col-8 card-body"><h2 class="card-title">' +
    titulo +
    '</h2>                     <button onclick="gotoNoticia(' +
    idnoticia +
    ')" class="btn btn-blue-inline">Ler mais &rarr;</button>        </div>    </div>    <div class="card-footer text-muted">        Postado ' +
    timestampToDate(date) +
    " por " +
    autor +
    "    </div></div>"
  );
}

function timestampToDate(timestamp) {
  var date = new Date(+timestamp);
  var formatedTime = date.toLocaleString("pt-BR", { dateStyle: "full" });
  return formatedTime;
}

function putPost(optional = "") {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3333/noticias" + optional, true);

  var noticiasElement = document.getElementById("noticia");
  xhr.onload = function() {
    noticias = JSON.parse(this.responseText);
    noticiasElement.innerHTML = "";
    noticias.map(
      ({
        idnoticia,
        imagem_endereco,
        postado_em,
        postado_por,
        texto,
        titulo
      }) => {
        noticiasElement.innerHTML += postStructure(
          idnoticia,
          imagem_endereco,
          titulo,
          texto,
          postado_em,
          postado_por
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
  var departamento = sessionStorage.getItem("departamento");
  putPost(departamento + "?include=true");
});
