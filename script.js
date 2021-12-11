const api_login = "https://reqres.in/api/users";

Object.size = function (obj) {
    var size = 0,
            key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};

function pegarElemento(valor) {
    return document.getElementById(valor);
}

function docReady(func) {
    document.addEventListener("DOMContentLoaded", function (event) {
        func(event);
    });
}

/*Exibir modal de login*/
function exibirModal() {
    pegarElemento("telaLogin").style.display = 'block';
}

/*FunÃ§Ã£o para fechar o modal de login*/
function fecharLogin() {
    pegarElemento("telaLogin").style.display = 'none';
}

/*Exibir modal de cadastro*/
function exibirCadastro() {
    pegarElemento("telaCadastro").style.display = 'block';
}

/*FunÃ§Ã£o para fechar o modal de cadastro*/
function fecharCadastro() {
    pegarElemento("telaCadastro").style.display = 'none';
}
 /* Função para exibir a tela principal */
function exibirMenu(nome){
    fecharLogin();
    pegarElemento("welcomeText").innerHTML = "BEM VINDO(A) " + nome;
    localStorage.setItem("usuario_nome", JSON.stringify(nome));
    pegarElemento("telaPrincipal").style.display = 'block';
}

/* Função para exibir o modal de consulta */
function exibirConsulta() {
    pegarElemento("telaConsulta").style.display = 'block';
}

/* Função para exibir o modal de postar */
function exibirPostar() {
    pegarElemento("telaPostar").style.display = 'block';
}

/* Função para sair do modal de consulta */
function fecharConsulta() {
    pegarElemento("telaConsulta").style.display = 'none';
}

/* Função para sair do modal de postagem */
function fecharPostar() {
    pegarElemento("telaPostar").style.display = 'none';
}

/* Sair da tela principal */
function logout() {
    localStorage.clear();
    pegarElemento("loginEmail").value = "";
    pegarElemento("loginSenha").value = "";
    pegarElemento("telaPrincipal").style.display = 'none';
}

/*Fechar o modal se clicar fora da div de login*/
var modal = pegarElemento("telaLogin");
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/*Fechar o modal se clicar fora da div de cadastro*/
var modal = pegarElemento("telaCadastro");
window.onclick = function (event) {
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
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        } else if (xmlHttp.readyState === 4 && xmlHttp.status === 400) {
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

/*FunÃ§Ã£o para recuperar o nome do usuÃ¡rio logado*/
function pegar_nome(page, email) {
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
        console.log("Houve algum erro ou usuÃ¡rio nÃ£o encontrado");
        return false;
    }

}
;

/*Funções para conferir os campos de login, email e senha a cada tecla no cadastro*/
var cadastroLogin = pegarElemento("cadastroLogin");
var cadastroEmail = pegarElemento("cadastroEmail");
var cadastroSenha = pegarElemento("cadastroSenha");

cadastroLogin.addEventListener('keyup', function () {
    var login = cadastroLogin.value;
    var erro = pegarElemento("loginErrorCadastro");

    if (!login || login.length < 1 || typeof login === "undefined") {
        erro.innerHTML = "*NOME DE USUÁRIO INVÁLIDO";
        cadastroLogin.className = "caixaTextoErro";
    } else {
        erro.innerHTML = "";
        cadastroLogin.className = "caixaTexto";
    }
})

cadastroEmail.addEventListener('keyup', function () {
    var email = cadastroEmail.value;
    var erro = pegarElemento("emailErrorCadastro");

    if (!email || email.length <= 3 || typeof email === "undefined") {
        erro.innerHTML = "*EMAIL INVÁLIDO";
        cadastroEmail.className = "caixaTextoErro";
    } else {
        erro.innerHTML = "";
        cadastroEmail.className = "caixaTexto";
    }
})

cadastroSenha.addEventListener('keyup', function () {
    var senha = cadastroSenha.value;
    var erro = pegarElemento("passwordErrorCadastro");

    if (!senha || senha.length <= 3 || typeof senha === "undefined") {
        erro.innerHTML = "*SENHA MUITO CURTA";
        cadastroSenha.className = "caixaTextoErro";
    } else {
        erro.innerHTML = "";
        cadastroSenha.className = "caixaTexto";
    }
})

/*Funções para conferir os campos de email e senha a cada tecla no login*/
var inputEmail = pegarElemento("loginEmail");
var inputSenha = pegarElemento("loginSenha");

inputEmail.addEventListener('keyup', function () {
    var email = inputEmail.value;
    var erro = pegarElemento("emailError");

    if (!email || email.length <= 3 || typeof email === "undefined") {
        erro.innerHTML = "*EMAIL INVÃ?LIDO";
        inputEmail.className = "caixaTextoErro";
    } else {
        erro.innerHTML = "";
        inputEmail.className = "caixaTexto";
    }
})

inputSenha.addEventListener('keyup', function () {
    var senha = inputSenha.value;
    var erro = pegarElemento("passwordError");

    if (!senha || senha.length <= 3 || typeof senha === "undefined") {
        erro.innerHTML = "*SENHA MUITO CURTA";
        inputSenha.className = "caixaTextoErro";
    } else {
        erro.innerHTML = "";
        inputSenha.className = "caixaTexto";
    }
})

/*Função chamada pelo botão de cadastrar*/
function cadastrar() {
    var login = pegarElemento("cadastroLogin").value;
    var email = pegarElemento("cadastroEmail").value;
    var password = pegarElemento("cadastroSenha").value;

    if (!login || login.length < 1 || typeof login === "undefined") {
        swal("Erro", "Preencha os campos corretamente", "error");
        return false;
    }

    if (!email || email.length <= 3 || typeof email === "undefined") {
        swal("Erro", "Preencha os campos corretamente", "error");
        return false;
    }

    if (!password || password.length <= 3 || typeof password === "undefined") {
        swal("Erro", "Preencha os campos corretamente", "error");
        return false;
    }

    axios.post('http://localhost:3333/register', {login, email, password})
        .then(function (res){
            console.log(res.data)
            swal("Sucesso", "Cadastrado com sucesso", "success");
            fecharCadastro();
        });
}

/*Função chamada pelo botão de logar*/
function logar() {
    var email = pegarElemento("loginEmail").value;
    var password = pegarElemento("loginSenha").value;

    axios.post('http://localhost:3333/login', {email, password})
        .then(function (res){
            fecharLogin();
            exibirMenu(res.data);
        });

}

/*Função chamada pelo botão de postar */
function postar(){
    var title = pegarElemento("postTitulo").value;
    var content = pegarElemento("postContent").value;
    var author = localStorage.getItem("usuario_nome");

    axios.post('http://localhost:3333/registerPost', {title, content, author})
        .then(function (res){
            swal("Sucesso", "Postagem feita", "success");
            pegarElemento("postTitulo").value = "";
            pegarElemento("postContent").value = "";
            fecharPostar();
        });
}

/*Função chamada pelo botão de buscar */
function consultar(){
    var title = pegarElemento("contSearch").value;
    var container = document.querySelector('.listaB');
    var query = document.querySelector('.caixaB').value;
    axios.post('http://localhost:3333/searchPost', {title})
        .then(function (res){
            console.log(res["data"]["dbpost"]);
            
            var elemento = document.getElementById("lB");
            while (elemento.firstChild) {
                elemento.removeChild(elemento.firstChild);
            }

            var dataAlready = [];
            var ponto = 0;

            for (var i = 0; i < Object.size(res["data"]); i++){
                //dataAlready.push(res["data"][i]["content"].toString());
            }

            console.log(dataAlready);
            var li;
            for (var x = 0; x < dataAlready.length; x++) {
                li = document.createElement('li');
                li.innerHTML = dataAlready[x];
                container.appendChild(li);
            }
        });
}

docReady(function () {
    var usuario_logado = localStorage.getItem("usuario_logado");
    var usuario_nome = localStorage.getItem("usuario_nome");
    if (usuario_logado || usuario_logado === "true") {
        console.log("VocÃª estÃ¡ logado como: " + usuario_nome);
        exibirConsulta(usuario_nome);
    }
});

function buscar() {
    var container = document.querySelector('.listaB');
    var query = document.querySelector('.caixaB').value;
    axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + query)
            .then(function (res) {
                console.log(res)
                var elemento = pegarElemento("lB");
                while (elemento.firstChild) {
                    elemento.removeChild(elemento.firstChild);
                }
                var dataAlready = [];
                var ponto = 0;
                console.log(res["data"]);

                for (var i = 0; i < Object.size(res["data"]); i++) {

                    for (var j = 0; j < Object.size(res["data"][i]["meanings"]); j++) {

                        for (var l = 0; l < Object.size(res["data"][i]["meanings"][j]); l++) {


                            for (var t = 0; t < Object.size(res["data"][i]["meanings"][j]["definitions"]); t++) {


                                for (var h = 0; h < dataAlready.length; h++) {
                                    if (res["data"][i]["meanings"][j]["definitions"][t]["definition"].toString() === dataAlready[h].toString()) {
                                        ponto++;
                                    }
                                }
                                if (ponto === 0) {


                                    dataAlready.push(res["data"][i]["meanings"][j]["definitions"][t]["definition"].toString());

                                }
                                ponto = 0;

                            }

                        }

                    }
                }
                console.log(dataAlready);
                var li;
                for (var x = 0; x < dataAlready.length; x++) {
                    li = document.createElement('li');
                    li.innerHTML = dataAlready[x];
                    container.appendChild(li);
                }

            });
     
}
;