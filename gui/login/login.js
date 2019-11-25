function Submit() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    if (!validation(user, pass)) {
        return
    }





}

// Função de validação básica de usuário e senha
function validation(user, pass) {
    if (user === '') {
        //TODO Criar efeito de usuário vazio
        return false;

    } else if (pass === '') {
        //TODO Criar efeito de senha vazio
        return false;
    } else if (pass.length < 6) {
        //TODO Criar efeito de senha menor que 6 caracteres
        return false;
    } else {
        return true;
    }
}