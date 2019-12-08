const NOTICIA_IMAGES_DIRECTORY =
  "/home/nicoedu/Documents/BBC/files/images/noticia/";

function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
  //extra html you want to store.
  return (
    '<div class="card mb-4"><div class="row"><div class="col-4 post-img"><img src=' +
    NOTICIA_IMAGES_DIRECTORY +
    imgsrc +
    '" alt="Card image cap" /></div><div class="col-8 card-body"><h2 class="card-title">' +
    titulo +
    '</h2>           <p class="card-text">                ' +
    texto +
    '            </p>            <button onclick="gotoNoticia(' +
    idnoticia +
    ')" class="btn btn-blue-simple">Ler mais &rarr;</button>        </div>    </div>    <div class="card-footer text-muted">        Postado em ' +
    timestampToDate(date) +
    " por " +
    autor +
    "    </div></div>"
  );
}

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

function putPost() {
  var xhr = new XMLHttpRequest();
  console.log("requesting");
  xhr.open("GET", "http://localhost:3333/noticias", true);

  var noticiasElement = document.getElementById("noticia");
  xhr.onload = function() {
    noticias = JSON.parse(this.responseText);
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
  // $.get("../general/navbar.html", function(data) {
  //     $("#nav").html(data);
  // });
  console.log("chamando funcao local");
  putPost();
});
