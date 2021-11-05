const api_login = "https://reqres.in/api/users";

function pegarValor(valor) {
    return document.getElementById(valor);
}

function docReady(func) {
    document.addEventListener("DOMContentLoaded", function (event) {
        func(event);
    });
}

function exibirModal(){
    pegarValor("telaLogin").style.display='block';
}

function fechar(){
    pegarValor("telaLogin").style.display='none';
}

function logar() {
    var login = pegarValor("loginEmail").value;
    var senha = pegarValor("loginSenha").value;

    if (!login || login.length <= 3 || typeof login === "undefined") {
        swal("Oops", "O login está nulo ou menor do que três caracteres", "error");
        return false;
    }

    if (!senha || senha.length <= 3 || typeof senha === "undefined") {
        swal("Oops", "A senha está nula ou menor do que três caracteres", "error");
        return false;
    }

    try {
        http_request("https://reqres.in/api/login", "POST", true, {
            "email": login,
            "password": senha
        }, function (e) {
            var resp = JSON.parse(e);
            elid("user_token").value = resp["token"];
            pegar_nome(1, login);
            swal("Ok", "Logado com sucesso!", "success");
            localStorage.setItem("usuario_logado", JSON.stringify("true"));
            localStorage.setItem("usuario_token", JSON.stringify(resp["token"]));
        });
    } catch (e) {
        swal("Oops", "Houve algum erro ou usuário não encontrado", "error");
        return false;
    }

};

var modal = pegarValor("telaLogin");
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

docReady(function () {
    var usuario_logado = localStorage.getItem("usuario_logado");
    var usuario_nome = localStorage.getItem("usuario_nome");
    var usuario_token = localStorage.getItem("usuario_token");
    if (usuario_logado || usuario_logado === "true") {

        console.log("Você está logado como: " + usuario_nome);
    }

});

function deslogar() {
    localStorage.clear();
};