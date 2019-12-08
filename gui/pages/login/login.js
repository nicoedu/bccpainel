function submitLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (!validation(username, password)) {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3333/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function() {
    console.log(this.status != 200){
        
    }
    var response = JSON.parse(this.responseText);
    sessionStorage.setItem("cpf", username);
    sessionStorage.setItem("token", response.token);
    if (response.token) {
      window.location = "../painelAdministrador/home/home.html";
    } else {
      sessionStorage.setItem("departamento", response.departamento);
      window.location = "../painelColaborador/noticia/noticia.html";
    }
  };
  xhr.onerror = function(event) {
    console.log(event);
  };
  xhr.send(JSON.stringify({ username: username, password: password }));
}

// Função de validação básica de usuário e senha
function validation(user, pass) {
  if (user === "") {
    //TODO Criar efeito de usuário vazio
    return false;
  } else if (pass === "") {
    //TODO Criar efeito de senha vazio
    return false;
  } else if (pass.length < 6) {
    //TODO Criar efeito de senha menor que 6 caracteres
    return false;
  } else {
    return true;
  }
}
