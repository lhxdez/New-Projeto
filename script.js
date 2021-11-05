const api_login = "https://reqres.in/api/users";

function pegarElemento(valor) {
    return document.getElementById(valor);
}

function docReady(func) {
    document.addEventListener("DOMContentLoaded", function (event) {
        func(event);
    });
}

/*Exibir modal de login*/
function exibirModal(){
    pegarElemento("telaLogin").style.display='block';
}

/*Função para fechar o modal de login*/
function fecharLogin(){
    pegarElemento("telaLogin").style.display='none';
}

/*Função para exibir o modal de consulta caso o usuário esteja logado*/
function exibirConsulta(nome){
    fecharLogin();
    pegarElemento("welcomeText").innerHTML = "BEM VINDO(A) " + nome;
    pegarElemento("telaConsulta").style.display='block';
}

function logout(){
    localStorage.clear();
    pegarElemento("loginEmail").value = "";
    pegarElemento("loginSenha").value = "";
    pegarElemento("telaConsulta").style.display='none';
}

/*Fechar o modal se clicar fora da div de login*/
var modal = pegarElemento("telaLogin");
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function arrayUrl(valor) {
    var keys = Object.keys(valor);
    var urlContent = "";
    for (var i = 0; i < keys.length; i++) {
        if (i === 0) {
            urlContent = keys[i] + "=" + valor[keys[i]];
        } else {
            urlContent += "&" + keys[i] + "=" + valor[keys[i]];
        }
    }
    return urlContent;
}

function http_request(url, method, type, data, callback, headers) {
    
    var xmlHttp = new XMLHttpRequest();
    if (typeof headers !== "undefined" && headers && headers !== null) {
        var size_headers = Object.size(headers) || null;
        var keys_headers = Object.keys(headers) || null;
    }

    /*Status 200 = login succesful, status 400 = login error*/
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
            callback(xmlHttp.responseText);
        }else if(xmlHttp.readyState === 4 && xmlHttp.status === 400){
            swal("Erro", "E-mail ou senha incorretos", "error")
        }
    };

    xmlHttp.open(method, url, type);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (size_headers !== null && keys_headers !== null) {
        for (var i = 0; i < size_headers; i++) {
            xmlHttp.setRequestHeader(keys_headers[i], headers[keys_headers[i]]);
        }
    }

    xmlHttp.send(arrayUrl(data));
}

/*Função para recuperar o nome do usuário logado*/
function pegar_nome(page, email){
    if (page === null) {
        return false;
    }

    try {
        http_request("https://reqres.in/api/users?page=" + page, "GET", true, {}, function (e) {
            var resp = JSON.parse(e);
            var again = true;

            for (var i = 0; i < resp["data"].length; i++) {
                if (email === resp["data"][i]["email"]) {
                    localStorage.setItem("usuario_nome", JSON.stringify(resp["data"][i]["first_name"]));
                    again = false;
                    console.log(localStorage.getItem("usuario_nome"));
                    exibirConsulta(localStorage.getItem("usuario_nome"));
                    return;
                }
            }

            if (again === true) {
                pegar_nome((parseInt(page) + 1), email);
            }
        });
    } catch (e) {
        console.log("Houve algum erro ou usuário não encontrado");
        return false;
    }

};

/*Funções para conferir os campos de email e senha a cada tecla*/
var inputEmail = pegarElemento("loginEmail");
var inputSenha = pegarElemento("loginSenha");

inputEmail.addEventListener('keyup', function(){
    var email = inputEmail.value;
    var erro = pegarElemento("emailError");

    if (!email || email.length <= 3 || typeof email === "undefined") {
        erro.innerHTML = "*EMAIL INVÁLIDO";
        inputEmail.className = "caixaTextoErro";
    }else{
        erro.innerHTML = "";
        inputEmail.className = "caixaTexto";
    }
})

inputSenha.addEventListener('keyup', function(){
    var senha = inputSenha.value;
    var erro = pegarElemento("passwordError");

    if (!senha || senha.length <= 3 || typeof senha === "undefined") {
        erro.innerHTML = "*SENHA MUITO CURTA";
        inputSenha.className = "caixaTextoErro";
    }else{
        erro.innerHTML = "";
        inputSenha.className = "caixaTexto";
    }
})

/*Função chamada pelo botão de logar*/
function logar() {
    var email = pegarElemento("loginEmail").value;
    var senha = pegarElemento("loginSenha").value;

    if (!email || email.length <= 3 || typeof email === "undefined") {
        swal("Erro", "Preencha os campos corretamente", "error");
        return false;
    }

    if (!senha || senha.length <= 3 || typeof senha === "undefined") {
        swal("Erro", "Preencha os campos corretamente", "error");
        return false;
    }

    try {
        http_request("https://reqres.in/api/login", "POST", true, {
            "email": email,
            "password": senha
        }, function (e) {
            var resp = JSON.parse(e);
            pegarElemento("user_token").value = resp["token"];
            pegar_nome(1, email);
            console.log("Logado com sucesso!");
            localStorage.setItem("usuario_logado", JSON.stringify("true"));
            localStorage.setItem("usuario_token", JSON.stringify(resp["token"]));
        });
    } catch (e) {
        console.log("Houve algum erro ou usuário não encontrado");
        return false;
    }

};

docReady(function () {
    var usuario_logado = localStorage.getItem("usuario_logado");
    var usuario_nome = localStorage.getItem("usuario_nome");
    if (usuario_logado || usuario_logado === "true") {
        console.log("Você está logado como: " + usuario_nome);
        exibirConsulta(usuario_nome);
    }
});