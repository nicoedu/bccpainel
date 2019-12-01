export function timestampToDate(timestamp) {
    var date = new Date(timestamp);
    var dia = date.getDate();
    var mes = date.getMonth(); //Be careful! January is 0 not 1
    var ano = date.getFullYear();
    var hora = date.getHours();
    var minuto = "0" + date.getMinutes();
    var formatedTime =
        dia + "/" + mes + "/" + ano + " ás " + hora + ":" + minuto.substr(-2);
    return formatedTime;
}