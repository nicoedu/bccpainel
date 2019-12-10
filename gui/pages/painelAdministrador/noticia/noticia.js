const NOTICIA_IMAGES_DIRECTORY =
  "/home/nicoedu/Documents/BBC/files/images/noticia/";

function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
  console.log(NOTICIA_IMAGES_DIRECTORY + imgsrc);
  //extra html you want to store.
  return (
    '<div class="card col-md-5 noticia-card"><div class="row"><div class="col-5 post-img"><img src="http://localhost:3333/image/?filename=' +
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
  xhr.open("GET", "http://localhost:3333/noticias" + optional, true);

  var noticiasElement = document.getElementById("noticia");
  xhr.onload = function() {
    noticias = JSON.parse(this.responseText);
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
        postado_por,
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

  $("#searchButton").on("click", () => {
    var searchInput = document.getElementById("searchInput");
    searchURL = "/search/" + searchInput.value;
    putPost(searchURL);
  });
  putPost();
});
