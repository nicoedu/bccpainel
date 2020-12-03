

function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
  //extra html you want to store.
  return (
    '<div class="card col-md-5 noticia-card"><div class="row card-content"><div class="col-5 post-img"><img src="http://localhost:3333/api/image/?filename=' +
    imgsrc +
    '" alt="Card image cap" /></div><div class="col-7 card-body"><h5 class="card-title">' +
    titulo +
    '</h5>                     <button onclick="gotoNoticia(' +
    idnoticia +
    ')" class="btn btn-blue-inline">Ler mais &rarr;</button>    </div>   </div>  <div class="card-footer text-muted">        Postado ' +
    timestampToDate(date) +
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
  xhr.open(
    "GET",
    "http://localhost:3333/api/noticias" + optional,
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
