$(function() {
    // if (sessionStorage.getItem("status") == null) {
    //     window.location = "../../login/login.html";
    // }
    $.get("../general/navbar.html", function(data) {
        $("#nav").html(data);
    });
});

function toContracheque() {
    window.location = "../contracheque/contracheque.html";
}

function toNoticia() {
    window.location = "../noticia/noticia.html";
}

function toConta() {
    window.location = "../usuario/usuario.html";
}