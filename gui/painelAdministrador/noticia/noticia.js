function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
    //extra html you want to store.
    return (
        '<div class="card mb-4"><div class="row"><div class="col-4 post-img"><img src="/home/nicoedu/Documents/BBC/meu/backend/noticia/' +
        imgsrc +
        '" alt="Card image cap" /></div><div class="col-8 card-body"><h2 class="card-title">' +
        titulo +
        '</h2>           <p class="card-text">                ' +
        texto +
        '            </p>            <button onclick="gotoNoticia(' +
        idnoticia +
        ')" class="btn btn-blue-simple">Ler mais &rarr;</button>        </div>    </div>    <div class="card-footer text-muted">        Postado ' +
        date +
        " por " +
        autor +
        "    </div></div>"
    );
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
    putPost();
});