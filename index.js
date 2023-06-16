let vetorJogadores = [];
let jogoRolando = false;
let jogoIniciado = false;

function gerarNumeroAleatorio(inicioIntervalo, fimIntervalo) {
    return Math.floor(Math.random() * (fimIntervalo - inicioIntervalo + 1)) + inicioIntervalo;
}

function gerarFileira(quantidadeNumeros, inicio, fim) {
    let cartela = [];
    for (let i = 0; i < quantidadeNumeros; i++) {
        let numeroCartelaExiste = true;
        while (numeroCartelaExiste) {
            let numeroAleatorio = gerarNumeroAleatorio(inicio, fim);
            if (cartela.includes(numeroAleatorio)) {
                numeroCartelaExiste = true;
            } else {
                numeroCartelaExiste = false;
                cartela.push(numeroAleatorio);
            }
        }
    }
    return cartela;
}

function gerarCartela() {
    return [
        gerarFileira(5, 1, 15),
        gerarFileira(5, 16, 30),
        gerarFileira(5, 31, 45),
        gerarFileira(5, 46, 60),
        gerarFileira(5, 61, 75)
    ];
}

function validarNome(nome) {
    if (!/^[a-zA-Z]+$/.test(nome)) {
        alert("O nome deve conter apenas letras!");
        return false;
    }

    for (let i = 0; i < vetorJogadores.length; i++) {
        if (vetorJogadores[i].nome === nome) {
            alert("Esse nome já está em uso, por favor, escolha outro nome.");
            return false;
        }
    }

    return true;
}

function gerarCartelaHTML() {
    if (jogoRolando) {
        alert("Não é possível gerar uma cartela com o jogo em andamento!");
        return;
    }

    if (jogoIniciado) {
        alert("O jogo já foi iniciado!");
        return;
    }

    let nomeJogador = prompt("Digite o nome do jogador:");
    if (!nomeJogador || nomeJogador.trim().length === 0) {
        alert("Você precisa digitar o nome do jogador!");
        return;
    } else if (nomeJogador.length <= 1) {
        alert("O nome é muito pequeno!");
        return;
    } else if (!validarNome(nomeJogador)) {
        return;
    }

    let titulo = ["B", "I", "N", "G", "O"];
    let cartela = gerarCartela();

    let jogador = {
        nome: nomeJogador,
        cartela: cartela
    };

    vetorJogadores.push(jogador);
    console.log(vetorJogadores);

    let divBingo = document.getElementById("bingo");

    let h3nome = document.createElement("h3");
    h3nome.style.textAlign = "center";
    h3nome.innerText = nomeJogador;

    let divCartela = document.createElement("div");
    divCartela.appendChild(h3nome);
    divCartela.className = "col-4";
    let divTabela = document.createElement("div");
    divTabela.style.display = "flex";
    divTabela.style.justifyContent = "center";
    let table = document.createElement("table");
    table.className = "borda-tabela";
    let tr = document.createElement("tr");

    titulo.forEach(function (elemento) {
        let td = document.createElement("td");
        td.innerText = elemento;
        tr.appendChild(td);
    });

    table.appendChild(tr);

    for (let linha = 0; linha < 5; linha++) {
        let tr = document.createElement("tr");
        for (let coluna = 0; coluna < 5; coluna++) {
            let td = document.createElement("td");
            td.className = "borda-tabela";
            if (linha === 2 && coluna === 2) {
                td.innerText = "X";
            } else {
                td.innerText = cartela[coluna][linha];
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    divTabela.appendChild(table);
    divCartela.appendChild(divTabela);
    divCartela.style.display = "inline";
    divBingo.appendChild(divCartela);
}

function verificaCartela(cartela, numerosSorteados, quantidadeNumeros) {
    if (numerosSorteados.length < quantidadeNumeros) {
        return false;
    }

    let numerosExistem = true;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (!numerosSorteados.includes(cartela[i][j])) {
                numerosExistem = false;
                return false;
            }
        }
    }

    if (numerosExistem) {
        return true;
    }
}

let jogoFinalizado = false;

function jogarBingo() {
    if (jogoIniciado) {
        alert("O jogo já está em andamento!");
        return;
    }

    if (vetorJogadores.length < 2) {
        alert("Você precisa ter pelo menos dois jogadores para jogar!!!");
        return;
    }

    jogoIniciado = true;
    let botaoGerarCartela = document.getElementById("botaoGerarCartela");
    botaoGerarCartela.classList.add("disabled");
    let vetorTds = document.getElementsByTagName("td");
    let numerosSorteados = [];
    let divSorteados = document.getElementById("sorteados");
    let intervalo = setInterval(function () {
        if (jogoFinalizado) {
            clearInterval(intervalo);
            return;
        }

        let numeroExiste = true;
        while (numeroExiste === true) {
            let numeroAleatorio = gerarNumeroAleatorio(1, 75);
            if (numerosSorteados.includes(numeroAleatorio) === true) {
                numeroExiste = true;
            } else {
                numeroExiste = false;
                numerosSorteados.push(numeroAleatorio);
                for (let i = 0; i < vetorTds.length; i++) {
                    if (vetorTds[i].innerText == numeroAleatorio) {
                        vetorTds[i].style.backgroundColor = "green";
                    }
                }
                let divNumero = document.createElement("div");
                divNumero.classList.add("col-2");
                divNumero.classList.add("sorteado");
                divNumero.innerText = numeroAleatorio;
                divSorteados.appendChild(divNumero);
                console.log("Números sorteados:", numerosSorteados);
                let vencedor = null;
                vetorJogadores.forEach(function (jogador) {
                    if (!vencedor && verificaCartela(jogador.cartela, numerosSorteados, 25)) {
                        vencedor = jogador;
                    }
                });
                if (vencedor) {
                    console.log(`${vencedor.nome} ganhou o BINGO! Parabéns!!`);
                    let h2Vencedor = document.getElementById("vencedor");
                    h2Vencedor.innerText = `${vencedor.nome} ganhou o BINGO! Parabéns!!\n`;
                    jogoFinalizado = true;
                }
            }
        }
        if (numerosSorteados.length >= 75) {
            console.log("Sorteio Finalizado!");
            clearInterval(intervalo);
        }
    }, 200);
}

function reiniciarJogo() {
    let bingo = document.querySelector("#bingo");
    let areaSorteio = document.querySelector("#sorteados");

    let cartelas = document.querySelectorAll("#bingo > div");
    let numerosSorteados = document.querySelectorAll("#sorteados > div");
    if (cartelas.length > 0) {
        let h2Vencedor = document.getElementById("vencedor");
        h2Vencedor.innerText = " ";
        vetorJogadores = [];
        jogoRolando = false;
        jogoIniciado = false;
        location.reload();
    }
}
