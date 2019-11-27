var noticias = document.getElementById("noticia");

function postStructure(imgsrc, titulo, texto, date, autor) {
    //extra html you want to store.
    return (
        '<div class="card mb-4"><div class="row"><div class="col-4 post-img"><img src="' +
        imgsrc +
        '" alt="Card image cap" /></div><div class="col-8 card-body"><h2 class="card-title">' +
        titulo +
        '</h2>           <p class="card-text">                ' +
        texto +
        '            </p>            <a href="#" class="btn btn-blue-simple">Ler mais &rarr;</a>        </div>    </div>    <div class="card-footer text-muted">        Postado ' +
        date +
        " por " +
        autor +
        "    </div></div>"
    );
}

function putPost() {
    //fazer isto para cada noticias
    noticias.innerHTML += postStructure(
        "",
        "lorem",
        "ipson",
        "01/01/01",
        "lorem"
    );
}

$(function() {
    console.log("jquery");
    putPost();
});