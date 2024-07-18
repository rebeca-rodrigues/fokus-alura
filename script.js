const html = document.querySelector('html');

const titulo = document.querySelector('.app__title');
const banner = document.querySelector('.app__image');

const botaoFoco = document.querySelector('.app__card-button--foco');
const botaoCurto = document.querySelector('.app__card-button--curto');
const botaoLongo = document.querySelector('.app__card-button--longo');
const botoes = document.querySelectorAll('.app__card-button');
const botaoTimer = document.querySelector('#start-pause');
const textoBtTimer = document.querySelector('#start-pause span');
const iconBtTimer = document.querySelector('#start-pause img');

const displayTimer = document.querySelector('#timer');

const tempoFoco = 15;
const tempoCurto = 3;
const tempoLongo = 9;

let temporizador = 15;
let intervaloId = null;
let estado = 'foco';

const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioEnd = new Audio('/sons/beep.mp3');

const musicaSwitch = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop=true;

mostrarTempo();

botaoFoco.addEventListener('click', () => {
    alterarContexto('foco');
});
botaoCurto.addEventListener('click', () => {
    alterarContexto('descanso-curto');
});
botaoLongo.addEventListener('click', () => {
    alterarContexto('descanso-longo');
});

function alterarContexto (contexto) {
    estado = contexto;
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    });

    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            botaoFoco.classList.add('active');
            temporizador = tempoFoco;
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            botaoCurto.classList.add('active');
            temporizador = tempoCurto;
            break;
        case 'descanso-longo':
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            botaoLongo.classList.add('active');
            temporizador = tempoLongo;
            break;
    }
    mostrarTempo();
}

musicaSwitch.addEventListener('change', () => {
    if (musica.paused) musica.play();
    else musica.pause();
});

botaoTimer.addEventListener('click', () => {
    if (intervaloId){
        audioPause.play();
        textoBtTimer.textContent = "Começar";
        iconBtTimer.setAttribute('src','/imagens/play_arrow.png');
        pausarContagem();
    }
    else {
        audioPlay.play();
        textoBtTimer.textContent = "Pausar";
        iconBtTimer.setAttribute('src','/imagens/pause.png');
        intervaloId = setInterval(contagemRegressiva, 1000);
    }
})

function contagemRegressiva () {
    
    if (temporizador > 0){
        temporizador -= 1;
    }
    else {
        //audioEnd.play();
        textoBtTimer.textContent = "Começar";
        iconBtTimer.setAttribute('src','/imagens/play_arrow.png');
        pausarContagem ();
        alert ('Tempo finalizado!')
        if (estado == 'foco'){
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
    }
    mostrarTempo();
}

function pausarContagem () {
    clearInterval(intervaloId);
    intervaloId = null;
}

function mostrarTempo () {
    const tempo = new Date (temporizador*1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    displayTimer.innerHTML = `${tempoFormatado}`;
}

function zerar (){
    alterarContexto (estado);
}