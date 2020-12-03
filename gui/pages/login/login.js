function submitLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (!validation(username, password)) {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://painel.bbcvigilancia.com.br/api/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (this.status != 200) {
      var usernameBox = document.getElementById("username");
      var passwordBox = document.getElementById("password");
      var passwordStatus = document.getElementById("passwordStatus");
      usernameBox.style = "border-color: red";
      passwordBox.style = "border-color: red";
      passwordStatus.innerHTML = "Usuário ou senha inválidos";
      console.log("erro");
      return;
    }
    var response = JSON.parse(this.responseText);
    console.log(response);
    sessionStorage.setItem("cpf", username);
    sessionStorage.setItem("token", response.token);
    if (response.admin) {
      window.location = "../painelAdministrador/home/index.html";
    } else {
      window.location = "../painelColaborador/noticia/index.html";
    }
  };
  xhr.onerror = function (event) {
    console.log(event);
  };
  xhr.send(JSON.stringify({ username: username, password: password }));
}

// Função de validação básica de usuário e senha
function validation(user, pass) {
  var usernameBox = document.getElementById("username");
  var passwordBox = document.getElementById("password");
  var usernameStatus = document.getElementById("usernameStatus");
  var passwordStatus = document.getElementById("passwordStatus");
  usernameBox.style = "border-color: black";
  passwordBox.style = "border-color: black";
  usernameStatus.innerHTML = "";
  passwordStatus.innerHTML = "";
  if (user === "") {
    usernameBox.style = "border-color: red";
    usernameStatus.innerHTML = "O campo de usuário não pode ser vazio";
    return false;
  } else if (pass === "") {
    passwordBox.style = "border-color: red";
    passwordStatus.innerHTML = "O campo de senha não pode ser vazio";
    return false;
  } else {
    return true;
  }
}
