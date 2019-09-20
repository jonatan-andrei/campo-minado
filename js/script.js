// Variáveis globais utilizadas para controles de exibição e do jogo
var jogoIniciado = false;
var exibeTabuleiro = false;
var primeiraJogada = true;
var campoMinado = null;

function iniciarJogo() {
    exibeTabuleiro = true;
    document.getElementById('area-menu-inicial').classList.add('esconder');
    document.getElementById('area-jogo').classList.remove('esconder');
    var nivel = criarNivel(document.getElementById('nivel').value);
    var cor = document.getElementById('cor').value;
    var vida = document.getElementById('vidas').value;
    if (jogoIniciado) {
        // Criar lógica para apagar tabela existente
    } else {
        criarCampoMinado(nivel, cor, vida);
    }
}

function retornarMenuPrincipal() {
    exibeTabuleiro = false;
    document.getElementById('area-jogo').classList.add('esconder');
    document.getElementById('area-menu-inicial').classList.remove('esconder');
}

function jogar(posicaoJogada) {
    if (primeiraJogada) {
        posicionarBombas(posicaoJogada);
        primeiraJogada = false;
    } else {

    }
}

function posicionarBombas(posicaoJogada) {
    var posicoesBombas = sortearPosicoesComBombas(posicaoJogada);
    console.log(posicoesBombas);
}

function sortearPosicoesComBombas(posicaoJogada) {
    var posicoesBombas = [];
    for (var i = 0; i < campoMinado.nivel.bombas; i++) {
        var posicaoInvalida = true;
        var posicao = null;
        do {
            posicao = sortearNumero();
            if (!posicoesBombas.includes(posicao) && posicaoJogada !== posicao) {
                posicaoInvalida = false;
            }
        } while (posicaoInvalida);
        posicoesBombas.push(posicao);
    }
    return posicoesBombas;
}

function sortearNumero() {
    var min = Math.ceil(1);
    var max = Math.floor(campoMinado.tabuleiro.length);
    return Math.floor(Math.random() * (max - min)) + min;
}

function criarNivel(codigo) {
    if (codigo === 'FACIL') {
        return new Nivel(7, 7, 7, 5, false);
    }
    else if (codigo === 'MEDIO') {
        return new Nivel(10, 10, 10, 0, false);
    }
    else { // DIFICIL
        return new Nivel(15, 15, 15, 0, false);
    }
}

function criarCampoMinado(nivel, cor, vidas) {
    var body = document.getElementsByTagName('body')[0];
    var tabela = document.createElement('table');
    tabela.setAttribute('border', '1');
    var tbody = document.createElement('tbody');
    var contador = 1;
    campoMinado = new CampoMinado(nivel, cor, vidas, []);
    for (var i = 0; i < nivel.linhas; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < nivel.colunas; j++) {
            var td = document.createElement('td');
            td.setAttribute('id', contador);
            td.setAttribute('class', 'celula');
            td.onclick = function () {
                jogar(contador);
            }
            tr.appendChild(td);
            campoMinado.tabuleiro[contador] = new Celula(contador, 0, i, j, false, false);
            contador++;

        }
        tbody.appendChild(tr);
    }
    tabela.appendChild(tbody);
    tabela.setAttribute('id', 'tabuleiro');
    body.appendChild(tabela);
}


class Nivel {
    constructor(linhas, colunas, bombas, dicas, personalizado) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.bombas = bombas;
        this.dicas = dicas;
        this.personalizado = personalizado;
    }
}

class CampoMinado {
    constructor(nivel, cor, vidas, tabuleiro) {
        this.nivel = nivel;
        this.cor = cor;
        this.vidas = vidas;
        this.tabuleiro = tabuleiro;
    }
}

class Celula {
    constructor(codigo, bombasProximas, linha, coluna, bomba, aberta) {
        this.codigo = codigo;
        this.bombasProximas = bombasProximas;
        this.linha = linha;
        this.coluna = coluna;
        this.bomba = bomba;
        this.aberta = aberta;
    }
}

