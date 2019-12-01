$(function() {
    getUserByCpf(sessionStorage.getItem("cpf"));
});
var usuario = null;

function getUserByCpf(cpf) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3333/user?cpf=" + cpf, true);

    xhr.onload = function() {
        console.log(this.responseText);
        usuario = JSON.parse(this.responseText)[0];
        var cpf = document.getElementById("cpf");
        var nome = document.getElementById("nome");
        var matricula = document.getElementById("matricula");
        var cargo = document.getElementById("cargo");
        var departamento = document.getElementById("departamento");
        cpf.innerHTML = usuario.cpf;
        nome.innerHTML = usuario.nome;
        matricula.innerHTML = usuario.matricula;
        cargo.innerHTML = usuario.cargo;
        departamento.innerHTML = usuario.departamento;
    };
    xhr.onerror = function(event) {
        console.log(event);
    };
    xhr.send();
}

function mudarSenha() {
    console.log(usuario);
    var senhaAntiga = document.getElementById("password-old").value;
    var senhaNova = document.getElementById("password-new").value;
    var senhaNova2 = document.getElementById("password-new2").value;
    if (senhaNova.length > 3) {
        if (senhaNova == senhaNova2) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:3333/updatePass", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function() {
                console.log(this.responseText);
            };
            xhr.onerror = function(event) {
                console.log(event);
            };
            xhr.send(
                JSON.stringify({
                    username: sessionStorage.getItem("cpf"),
                    passwordOld: senhaAntiga,
                    passwordNew: senhaNova
                })
            );
        }
    }
}