// Variáveis globais utilizadas para controles de exibição e do jogo
var jogoIniciado = false;

function iniciarJogo() {
    jogoIniciado = true;
    document.getElementById('area-menu-inicial').classList.add('esconder');
    document.getElementById('area-jogo').classList.remove('esconder');
    var nivel = nivelPorCodigo(document.getElementById('nivel').value);
    console.log(nivel);
}

function retornarMenuPrincipal() {
    jogoIniciado = false;
    document.getElementById('area-jogo').classList.add('esconder');
    document.getElementById('area-menu-inicial').classList.remove('esconder');
}

function nivelPorCodigo(id) {
    if (id === 'FACIL') {
        return new Nivel(7, 7, 7, 5, false);
    }
    else if (id === 'MEDIO') {
        return new Nivel(10, 10, 10, 0, false);
    }
    else { // DIFICIL
        return new Nivel(15, 15, 15, 0, false);
    }
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

