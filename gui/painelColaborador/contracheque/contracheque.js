$(function() {
    $.get("../general/navbar.html", function(data) {
        $("#nav").html(data);
    });
});