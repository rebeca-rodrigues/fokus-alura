const btAddTarefa = document.querySelector('.app__button--add-task');
const formAddTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const mostraAndamento = document.querySelector ('.app__section-active-task-description');
const btRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btRemoverTodas = document.querySelector('#btn-remover-todas')

let listaTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function criaElementoTarefa (tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const p = document.createElement('p');
    p.textContent = tarefa.descricao;
    p.classList.add('app__section-task-list-item-description');

    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('app_button-edit');
    const imagemBtEditar = document.createElement('img');
    imagemBtEditar.setAttribute('src', '/imagens/edit.png');
    botaoEditar.append(imagemBtEditar);

    botaoEditar.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        if (novaDescricao){
            p.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;   
            atualizarTarefas();
        }
    }

    li.append(svg);
    li.append(p);
    li.append(botaoEditar);

    if (tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        botaoEditar.setAttribute('disabled', 'disabled');
    }
    else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach (elemento => {
                elemento.classList.remove ('app__section-task-list-item-active');
            })
            if (tarefa == tarefaSelecionada){
                mostraAndamento.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            mostraAndamento.textContent = tarefa.descricao;
            li.classList.add ('app__section-task-list-item-active');
        }
    }

    return li;
}

function atualizarTarefas (){
    localStorage.setItem('tarefas', JSON.stringify(listaTarefas));
}

btAddTarefa.addEventListener('click', () => {
    formAddTarefa.classList.toggle('hidden');
});

formAddTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const novaTarefa = {
        descricao: textArea.value
    }
    listaTarefas.push(novaTarefa);
    const elementoTarefa = criaElementoTarefa(novaTarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textArea.value = '';
    formAddTarefa.classList.add('hidden');

});

listaTarefas.forEach(tarefa => {
    const elementoTarefa = criaElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

document.addEventListener ('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    listaTarefas = somenteCompletas ? listaTarefas.filter (tarefa => !tarefa.completa) : []
    atualizarTarefas();
}

btRemoverConcluidas.onclick = () => removerTarefas(true);
btRemoverTodas.onclick = () => removerTarefas(false);