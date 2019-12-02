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

function getNoticiaPorId(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3333/noticia?id=" + id, true);
    xhr.onload = function() {
        console.log(this.responseText);
        var noticia = JSON.parse(this.responseText)[0];
        var titulo = document.getElementById("titulo");
        var texto = document.getElementById("texto");
        var postado_por = document.getElementById("postado_por");
        var postado_em = document.getElementById("postado_em");
        var imagem = document.getElementById("imagem");
        imagem.src =
            "/home/nicoedu/Documents/BBC/meu/backend/noticia/" +
            noticia.imagem_endereco;
        titulo.innerHTML = noticia.titulo;
        texto.innerHTML = noticia.texto;
        postado_por.innerHTML += noticia.postado_por;
        postado_em.innerHTML += timestampToDate(noticia.postado_em);
    };
    xhr.onerror = function(event) {
        console.log(event);
    };
    xhr.send();
}

$(function() {
    $.get("../general/navbar.html", function(data) {
        $("#nav").html(data);
    });
    const url = new URL(window.location.href);
    getNoticiaPorId(url.searchParams.get("id"));
});