$(function() {
  // if (sessionStorage.getItem("cpf") == null) {
  //     window.location = "../../login/login.html";
  // }
  $.get("../general/navbar.html", function(data) {
    $("#nav").html(data);
  });
});
