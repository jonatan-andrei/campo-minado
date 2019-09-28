// Variáveis globais utilizadas para controles de exibição e do jogo
var jogoIniciado = false;
var primeiroJogo = true;
var exibeTabuleiro = false;
var primeiraJogada = true;
var campoMinado = null;
var bloqueiaTabuleiroFimDeJogo = false;
var corCelulas = 'azul';
var textoSalvarJogo = document.createTextNode("Salvar jogo");

function iniciarJogo() {
    document.getElementById('botao-continuar').classList.remove('esconder');
    primeiraJogada = true;
    exibeTabuleiro = true;
    bloqueiaTabuleiroFimDeJogo = false;
    document.getElementById('area-menu-inicial').classList.add('esconder');
    document.getElementById('area-jogo').classList.remove('esconder');
    var nivel = criarNivel(document.getElementById('nivel').value);
    var cor = document.getElementById('cor').value;
    var vida = document.getElementById('vidas').value;
    if (primeiroJogo) {
        var botaoSalvar = document.getElementById('botao-salvar');
        botaoSalvar.append(textoSalvarJogo);
        primeiroJogo = false;
    } else {
        document.getElementById('tabuleiro').remove();
        textoSalvarJogo.nodeValue = "Salvar jogo";
        // Desbloquear botão desistir
    }
    criarCampoMinado(nivel, cor, vida);
    jogoIniciado = true;
}

function continuarJogo() {
    exibeTabuleiro = true;
    document.getElementById('area-menu-inicial').classList.add('esconder');
    document.getElementById('area-jogo').classList.remove('esconder');
}

function salvarJogo() {
    exibeTabuleiro = false;
    document.getElementById('area-jogo').classList.add('esconder');
    document.getElementById('area-menu-inicial').classList.remove('esconder');
}

function jogar(posicaoJogada) {
    // TODO Bloqueia jogada simultânea
    if (!campoMinado.tabuleiro[posicaoJogada].aberta && !bloqueiaTabuleiroFimDeJogo) {
        var jogadaValida = true;
        campoMinado.tabuleiro[posicaoJogada].aberta = true;
        removerCorAoAbrirCelula(posicaoJogada);
        if (primeiraJogada) {
            posicionarBombas(posicaoJogada);
            primeiraJogada = false;
            exibirBombasProximasCodigo(posicaoJogada);
        } else {
            if (campoMinado.tabuleiro[posicaoJogada].bomba) {
                jogadaValida = false;
                campoMinado.vidasRestantes--;
                var td = document.getElementById(posicaoJogada);
                td.append("B"); // TODO Adicionar imagem de bomba
                if (campoMinado.vidasRestantes === 0) {
                    finalizarJogo(false, false);
                }
            } else {
                exibirBombasProximasCodigo(posicaoJogada);
            }
        }
        if (jogadaValida) {
            if (campoMinado.tabuleiro[posicaoJogada].bombasProximas === 0) {
                abrirCasasProximasDeCelula(campoMinado.tabuleiro[posicaoJogada]);
            }
            if (campoMinado.celulasSemBombaReveladas === campoMinado.nivel.celulasSemBomba) {
                finalizarJogo(true, false);
            }
        }
    }
    // TODO Desbloqueia jogada simultânea
}

function desistir() {
    finalizarJogo(false, true);
}

function finalizarJogo(vencedor, desistencia) {
    document.getElementById('botao-continuar').classList.add('esconder');
    bloqueiaTabuleiroFimDeJogo = true;
    jogoIniciado = false;
    textoSalvarJogo.nodeValue = "Voltar a página inicial";
    // Bloquear botão desistir

    if (desistencia) {
        document.getElementById('area-jogo').classList.add('esconder');
        document.getElementById('area-menu-inicial').classList.remove('esconder');
    }
    else if (vencedor) {
        alert("Parabéns! Você venceu o jogo! Clique em reiniciar jogo para jogar novamente.");
    } else {
        alert("Você perdeu! Clique em reiniciar jogo para jogar novamente.");
    }
}

function abrirCasasProximasDeCelula(celula) {
    exibirBombasProximasLinhaColuna(celula.linha, celula.coluna + 1);
    exibirBombasProximasLinhaColuna(celula.linha, celula.coluna - 1);
    exibirBombasProximasLinhaColuna(celula.linha + 1, celula.coluna);
    exibirBombasProximasLinhaColuna(celula.linha + 1, celula.coluna + 1);
    exibirBombasProximasLinhaColuna(celula.linha + 1, celula.coluna - 1);
    exibirBombasProximasLinhaColuna(celula.linha - 1, celula.coluna);
    exibirBombasProximasLinhaColuna(celula.linha - 1, celula.coluna + 1);
    exibirBombasProximasLinhaColuna(celula.linha - 1, celula.coluna - 1);
}

function exibirBombasProximasLinhaColuna(linha, coluna) {
    var celula = buscarCelulaPorPosicao(linha, coluna);
    if (celula && !celula.aberta) {
        celula.aberta = true;
        removerCorAoAbrirCelula(celula.codigo);
        exibirBombasProximasCodigo(celula.codigo);
        if (celula.bombasProximas === 0) {
            abrirCasasProximasDeCelula(celula);
        }
    }
}

function removerCorAoAbrirCelula(codigo) {
    var td = document.getElementById(codigo);
    td.classList.remove(corCelulas);
}

function exibirBombasProximasCodigo(codigo) {
    campoMinado.celulasSemBombaReveladas++;
    var td = document.getElementById(codigo);
    if (campoMinado.tabuleiro[codigo].bombasProximas) {
        td.append(document.createTextNode(campoMinado.tabuleiro[codigo].bombasProximas));
    }
}

function posicionarBombas(posicaoJogada) {
    var posicoesBombas = sortearPosicoesComBombas(posicaoJogada);
    for (var i = 0; i < posicoesBombas.length; i++) {
        campoMinado.tabuleiro[posicoesBombas[i]].bomba = true;
    }
    for (var i = 1; i < campoMinado.tabuleiro.length; i++) {
        if (!(posicoesBombas.includes(campoMinado.tabuleiro[i].codigo))) {
            var bombasProximas = calcularBombasProximasCelula(campoMinado.tabuleiro[i]);
            campoMinado.tabuleiro[i].bombasProximas = bombasProximas;
        }
    }
}

function calcularBombasProximasCelula(celula) {
    var bombasProximas = 0;
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha, celula.coluna + 1))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha, celula.coluna - 1))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha + 1, celula.coluna))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha + 1, celula.coluna + 1))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha + 1, celula.coluna - 1))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha - 1, celula.coluna))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha - 1, celula.coluna + 1))) {
        bombasProximas++;
    }
    if (verificarBomba(buscarCelulaPorPosicao(celula.linha - 1, celula.coluna - 1))) {
        bombasProximas++;
    }
    return bombasProximas;
}

function verificarBomba(celula) {
    return celula && celula.bomba;
}

function buscarCelulaPorPosicao(linha, coluna) {
    // TODO verificar maneira melhor de fazer essa busca
    for (var i = 1; i < campoMinado.tabuleiro.length; i++) {
        if (campoMinado.tabuleiro[i].linha === linha && campoMinado.tabuleiro[i].coluna === coluna) {
            return campoMinado.tabuleiro[i];
        }
    }
    return null;
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
        return new Nivel(10, 10, 10, 5, false);
    }
    else if (codigo === 'MEDIO') {
        return new Nivel(15, 15, 20, 1, false);
    }
    else { // DIFICIL
        return new Nivel(20, 20, 40, 1, false);
    }
}

function criarCampoMinado(nivel, cor, vidas) {
    var areaTabuleiro = document.getElementById('espaco-tabuleiro');
    corCelulas = cor;
    var tabela = document.createElement('table');
    tabela.setAttribute('border', '1');
    var tbody = document.createElement('tbody');
    var contador = 1;
    campoMinado = new CampoMinado(nivel, cor, vidas, []);
    for (var i = 1; i <= nivel.linhas; i++) {
        var tr = document.createElement('tr');
        for (var j = 1; j <= nivel.colunas; j++) {
            var td = document.createElement('td');
            campoMinado.tabuleiro[contador] = new Celula(contador, 0, i, j, false, false);
            td.setAttribute('id', contador);
            td.setAttribute('class', 'celula ' + corCelulas);
            td.onclick = function () {
                jogar(parseInt(this.id));
            }
            tr.appendChild(td);
            contador++;

        }
        tbody.appendChild(tr);
    }
    tabela.appendChild(tbody);
    tabela.setAttribute('id', 'tabuleiro');
    areaTabuleiro.appendChild(tabela);
}

class Nivel {
    constructor(linhas, colunas, bombas, dicas, personalizado) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.bombas = bombas;
        this.dicas = dicas; // TODO implementar dicas
        this.personalizado = personalizado;
        this.celulasSemBomba = (linhas * colunas) - bombas;
    }
}

class CampoMinado {
    constructor(nivel, cor, vidas, tabuleiro) {
        this.nivel = nivel;
        this.cor = cor;
        this.vidas = parseInt(vidas);
        this.tabuleiro = tabuleiro;
        this.celulasSemBombaReveladas = 0;
        this.vidasRestantes = parseInt(vidas);
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
