// Variáveis globais utilizadas para controles de exibição e do jogo
var jogoIniciado = false;
var exibeTabuleiro = false;
var primeiraJogada = true;
var campoMinado = null;
var bloqueiaTabuleiroFimDeJogo = false;

function iniciarJogo() {
    exibeTabuleiro = true;
    bloqueiaTabuleiroFimDeJogo = false;
    document.getElementById('area-menu-inicial').classList.add('esconder');
    document.getElementById('area-jogo').classList.remove('esconder');
    var nivel = criarNivel(document.getElementById('nivel').value);
    var cor = document.getElementById('cor').value;
    var vida = document.getElementById('vidas').value;
    if (jogoIniciado) {
        // Criar lógica para apagar tabela existente
    } else {
        criarCampoMinado(nivel, cor, vida);
        jogoIniciado = true;
    }
}

function retornarMenuPrincipal() {
    exibeTabuleiro = false;
    document.getElementById('area-jogo').classList.add('esconder');
    document.getElementById('area-menu-inicial').classList.remove('esconder');
}

function jogar(posicaoJogada) {
    // Bloqueia jogada simultânea
    if (!campoMinado.tabuleiro[posicaoJogada].aberta && !bloqueiaTabuleiroFimDeJogo) {
        var jogadaValida = true;
        campoMinado.tabuleiro[posicaoJogada].aberta = true;
        if (primeiraJogada) {
            campoMinado.celulasSemBombaReveladas++;
            posicionarBombas(posicaoJogada);
            primeiraJogada = false;
        } else {
            if (campoMinado.tabuleiro[posicaoJogada].bomba) {
                jogadaValida = false;
                // Revela bomba e faz verificação se tem vidas
                // se não tem mais vidas bloqueiaTabuleiroFimDeJogo = true;
                // Notifica que usuário perdeu
            } else {
                campoMinado.celulasSemBombaReveladas++;
                // Revela número
            }
        }
        // Revela casas próximas sem bomba
        if (jogadaValida) {
            if (campoMinado.celulasSemBombaReveladas === campoMinado.nivel.celulasSemBomba) {
                // Jogo acabou e existe vencedor
                bloqueiaTabuleiroFimDeJogo = true;
            }
        }
    }
    // Desbloqueia jogada
}

function posicionarBombas(posicaoJogada) {
    var posicoesBombas = sortearPosicoesComBombas(posicaoJogada);
    for (var i = 0; i < posicoesBombas.length; i++) {
        campoMinado.tabuleiro[posicoesBombas[i]].bomba = true;
    }
    for (var i = 0; i < campoMinado.tabuleiro.length; i++) {
        if (!(posicoesBombas.includes(campoMinado.tabuleiro[i].codigo))) {
            var bombasProximas = calcularBombasProximasPosicao(campoMinado.tabuleiro[i]);
            campoMinado.tabuleiro[i].bombasProximas = bombasProximas;
        }
    }
    for (var i = 0; i < campoMinado.tabuleiro.length; i++) {
        console.log(campoMinado.tabuleiro[i]);
    }
}

function calcularBombasProximasPosicao(celula) {
    var bombasProximas = 0;
    if (celula.linha === 1) {
        if (celula.coluna === 1) {
            if (buscarCelulaPorPosicao(1, 2).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, 2).bomba) {
                bombasProximas++;
            }
        } else if (campoMinado.nivel.colunas === celula.coluna) {
            if (buscarCelulaPorPosicao(1, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, celula.coluna).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
        } else {
            if (buscarCelulaPorPosicao(1, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(1, celula.coluna + 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, celula.coluna).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(2, celula.coluna + 1).bomba) {
                bombasProximas++;
            }
        }
    }
    else if (campoMinado.nivel.linhas === celula.linha) {
        if (celula.coluna === 1) {
            if (buscarCelulaPorPosicao(celula.linha, 2).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, 2).bomba) {
                bombasProximas++;
            }
        } else if (campoMinado.nivel.colunas === celula.coluna) {
            if (buscarCelulaPorPosicao(celula.linha, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, celula.coluna).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
        } else {
            if (buscarCelulaPorPosicao(celula.linha, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha, celula.coluna + 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, celula.coluna).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, celula.coluna - 1).bomba) {
                bombasProximas++;
            }
            if (buscarCelulaPorPosicao(celula.linha - 1, celula.coluna + 1).bomba) {
                bombasProximas++;
            }
        }
    } else {
        if (celula.coluna === 1) {

        } else if (campoMinado.nivel.colunas === celula.coluna) {

        } else {

        }
    }
    return bombasProximas;
}

function buscarCelulaPorPosicao(linha, coluna) {
    // TODO verificar maneira melhor de fazer essa busca
    for (var i = 0; i < campoMinado.tabuleiro.length; i++) {
        if (campoMinado.tabuleiro[i].linha === linha && campoMinado.tabuleiro[i].coluna === coluna) {
            return campoMinado.tabuleiro[i];
        }
    }
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
    var areaJogo = document.getElementById('area-jogo');
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
            td.setAttribute('class', 'celula');
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
    areaJogo.appendChild(tabela);
}


class Nivel {
    constructor(linhas, colunas, bombas, dicas, personalizado) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.bombas = bombas;
        this.dicas = dicas;
        this.personalizado = personalizado;
        this.celulasSemBomba = (linhas * colunas) - bombas;
    }
}

class CampoMinado {
    constructor(nivel, cor, vidas, tabuleiro) {
        this.nivel = nivel;
        this.cor = cor;
        this.vidas = vidas;
        this.tabuleiro = tabuleiro;
        this.celulasSemBombaReveladas = 0;
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

