$(function() {
  if (sessionStorage.getItem("admin") == false) {
    window.location = "../../login/login.html";
  }
  $.get("../general/navbar.html", function(data) {
    $("#nav").html(data);
  });
});
