const api_login = "https://reqres.in/api/users";

Object.size = function (obj) {
    var size = 0,
            key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;.
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
        swal("Erro", "Escolha um nome de usuário válido", "error");
        return false;
    }

    if (!email || email.length <= 3 || typeof email === "undefined") {
        swal("Erro", "Insira um e-mail válido", "error");
        return false;
    }

    if (!password || password.length <= 3 || typeof password === "undefined") {
        swal("Erro", "Insira uma senha válida", "error");
        return false;
    }

    axios.post('https://lhxdez.github.io/New-Projeto/register', {login, email, password})
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

    axios.post('https://lhxdez.github.io/New-Projeto/login', {email, password})
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

    if (!title || title.length < 1 || typeof title === "undefined") {
        swal("Erro", "O post deve ter um título/assunto", "error");
        return false;
    }

    if (!content || content.length <= 3 || typeof content === "undefined") {
        swal("Erro", "O post deve ter um conteúdo", "error");
        return false;
    }

    axios.post('https://lhxdez.github.io/New-Projeto/registerPost', {title, content, author})
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
    axios.post('https://lhxdez.github.io/New-Projeto/searchPost', {title})
        .then(function (res){
            
            var elemento = document.getElementById("lB");
            while (elemento.firstChild) {
                elemento.removeChild(elemento.firstChild);
            }

            var dataAlready = [];

            for (var i = 0; i < Object.size(res["data"]["dbpost"]); i++){
                dataAlready.push(res["data"]["dbpost"][i]["title"].toString());
                dataAlready.push(res["data"]["dbpost"][i]["content"].toString());
                dataAlready.push(res["data"]["dbpost"][i]["author"].toString());
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
