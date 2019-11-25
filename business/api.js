function get() {
    var client = new XMLHttpRequest();
    var url = 'get_data.php';
    client.open('GET', url);
    client.onload = function() {
        if (client.status === 200) {
            alert('User\'s name is ' + client.responseText);
        } else {
            alert('Request failed.  Returned status of ' + client.status);
        }
    };
    client.send();
}

function post() {
    var client = new XMLHttpRequest();
    var url = 'get_data.php';
    client.open('POST', url, true);

    //Send the proper header information along with the request
    client.setRequestHeader("Content-Type", "application/json; utf-8");

    client.onreadystatechange = function() { //Call a function when the state changes.
        if (client.readyState == 4 && client.status == 200) {
            alert(client.responseText);
        }
    }
    client.send(params);
}

function login(username, password) {
    var client = new XMLHttpRequest();
    var url = 'get_data.php';
    client.open('POST', url, true);

    //Send the proper header information along with the request
    client.setRequestHeader("Content-Type", "application/json; utf-8");

    client.onreadystatechange = function() { //Call a function when the state changes.
        if (client.readyState == 4 && client.status == 200) {
            alert(client.responseText);
        }
    }
    client.send(JSON.stringify({ "username": username, "password": password }));
}