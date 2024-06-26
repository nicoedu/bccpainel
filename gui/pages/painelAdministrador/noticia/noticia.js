function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
  return (
    '<div class="card col-md-5 noticia-card"><div class="row"><div class="col-5 post-img"><img src="https://painel.bbcvigilancia.com.br/api/image/?filename=' +
    imgsrc +
    '" alt="Card image cap" /></div><div class="col-7 card-body"><h5 class="card-title">' +
    titulo +
    '</h5>                     <button onclick="gotoNoticia(' +
    idnoticia +
    ')" class="btn btn-blue-inline">Ler mais &rarr;</button>    </div>   </div>  <div class="card-footer text-muted">        Postado ' +
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
    console.log(noticias);
    noticiasElement.innerHTML = "";
    if (noticias.length == 0) {
      noticiasElement.classList = "empityNoticia";
      noticiasElement.innerHTML = "<p>Nenhuma notícia encontrada</p>";
    }
    noticias.map(
      ({
        idnoticia,
        imagem_endereco,
        postado_em,
        texto,
        titulo
      }) => {
        console.log(titulo, imagem_endereco);
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
