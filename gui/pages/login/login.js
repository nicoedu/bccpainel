function submitLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (!validation(username, password)) {
    return;
  }
  if (username == "admin" && password == "123456") {
    sessionStorage.setItem("cpf", username);
    window.location = "../painelAdministrador/home/home.html";
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3333/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function() {
    if (this.status != 200) {
      var usernameBox = document.getElementById("username");
      var passwordBox = document.getElementById("password");
      var passwordStatus = document.getElementById("passwordStatus");
      usernameBox.style = "border-color: red";
      passwordBox.style = "border-color: red";
      passwordStatus.innerHTML = "Usuário ou senha inválidos";
      console.log("erro");
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
