function postStructure(idnoticia, imgsrc, titulo, texto, date, autor) {
    //extra html you want to store.
    return (
        '<div class="card mb-4"><div class="row"><div class="col-4 post-img"><img src="' +
        imgsrc +
        '" alt="Card image cap" /></div><div class="col-8 card-body"><h2 class="card-title">' +
        titulo +
        '</h2>           <p class="card-text">                ' +
        texto +
        '            </p>            <button onclick="getNoticiaPorId(' +
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

function getNoticiaPorId(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3333/noticia?id=" + id, true);
    xhr.onload = function() {
        console.log(this.responseText);
        var titulo = document.getElementById("titulo");
        var texto = document.getElementById("texto");
        var postado_por = document.getElementById("postado_por");
        var postado_em = document.getElementById("postado_em");
        // titulo.innerHTML =
    };
    xhr.onerror = function(event) {
        console.log(event);
    };
    xhr.send();
}

$(function() {
    putPost();
});