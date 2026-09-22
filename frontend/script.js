const API_URL = 'http://localhost:3000';

let receitasFavoritasIds = new Set();
let todasReceitas = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarReceitas();

    const inputBusca = document.getElementById('input-busca');
    if (inputBusca) {
        inputBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarChef();
        });
    }
});

async function carregarReceitas() {
    const msgErro = document.getElementById('erro-busca');
    if (msgErro) msgErro.classList.add('hidden');

    try {
        const response = await fetch(`${API_URL}/receitas`);
        if (!response.ok) throw new Error('Erro na requisição');
        todasReceitas = await response.json();
    } catch (error) {
        console.warn('Backend indisponível. Carregando dados locais...');
        todasReceitas = [
            { id_receita: 1, titulo_receita: "Receita 1", url_imagem: "/anexos_prova/receitas/receita1.jpg", favoritos: 0 },
            { id_receita: 2, titulo_receita: "Receita 2", url_imagem: "/anexos_prova/receitas/receita2.jpg", favoritos: 0 },
            { id_receita: 3, titulo_receita: "Receita 3", url_imagem: "/anexos_prova/receitas/receita3.jpg", favoritos: 0 },
            { id_receita: 4, titulo_receita: "Receita 4", url_imagem: "/anexos_prova/receitas/receita4.jpg", favoritos: 0 },
            { id_receita: 5, titulo_receita: "Receita 5", url_imagem: "/anexos_prova/receitas/receita5.jpg", favoritos: 0 },
            { id_receita: 6, titulo_receita: "Receita 6", url_imagem: "/anexos_prova/receitas/receita6.jpg", favoritos: 0 },
            { id_receita: 7, titulo_receita: "Receita 7", url_imagem: "/anexos_prova/receitas/receita7.jpg", favoritos: 0 },
            { id_receita: 8, titulo_receita: "Receita 8", url_imagem: "/anexos_prova/receitas/receita8.jpg", favoritos: 0 },
            { id_receita: 9, titulo_receita: "Receita 9", url_imagem: "/anexos_prova/receitas/receita9.jpg", favoritos: 0 }
        ];
    }

    exibirReceitas(todasReceitas);
    atualizarContadoresPerfil();
}


function exibirReceitas(receitas) {
    const mural = document.getElementById('mural-receitas');
    if (!mural) return;

    mural.innerHTML = '';

    if (!receitas || receitas.length === 0) {
        mural.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhuma receita encontrada.</p>';
        return;
    }

    receitas.forEach(receita => {
        const isFavorita = receitasFavoritasIds.has(receita.id_receita);
        const card = document.createElement('div');
        card.className = 'card-receita';

        const imgUrl = receita.url_imagem ? receita.url_imagem : '/anexos_prova/receitas/receita1.jpg';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${receita.titulo_receita}" class="foto-receita" onerror="this.src='https://via.placeholder.com/300x200?text=Receita'">
            <div class="card-info">
                <h3 class="titulo-receita">${receita.titulo_receita}</h3>
                <div class="favoritos ${isFavorita ? 'favoritado' : ''}" onclick="favoritarReceita(${receita.id_receita})">
                    <span class="estrela-btn">&#9733;</span>
                    <span id="fav-count-${receita.id_receita}">${receita.favoritos || 0}</span>
                </div>
            </div>
        `;
        mural.appendChild(card);
    });
}


async function favoritarReceita(id) {
    const receita = todasReceitas.find(r => r.id_receita === id);
    if (!receita) return;

    if (receitasFavoritasIds.has(id)) {
        receitasFavoritasIds.delete(id);
        receita.favoritos = Math.max(0, (receita.favoritos || 0) - 1);
    } else {
        receitasFavoritasIds.add(id);
        receita.favoritos = (receita.favoritos || 0) + 1;
    }

    exibirReceitas(todasReceitas);
    atualizarContadoresPerfil();
}


function atualizarContadoresPerfil() {
    const elTotalFavoritos = document.getElementById('total-favoritos');
    const elTotalReceitas = document.getElementById('total-receitas');

    if (elTotalFavoritos) elTotalFavoritos.textContent = receitasFavoritasIds.size;
    if (elTotalReceitas) elTotalReceitas.textContent = todasReceitas.length;
}


function carregarSuasReceitas() {
    const receitasFavoritas = todasReceitas.filter(r => receitasFavoritasIds.has(r.id_receita));
    exibirReceitas(receitasFavoritas);
    fecharMenuLateral();
}


function abrirMenuLateral() {
    atualizarContadoresPerfil();
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('overlay-sidebar')?.classList.add('active');
}

function fecharMenuLateral() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay-sidebar')?.classList.remove('active');
}

n
function abrirModalLogin() { document.getElementById('authModal')?.showModal(); }
function fecharModalLogin() { document.getElementById('authModal')?.close(); }


async function buscarChef() {
    const input = document.getElementById('input-busca').value.trim();
    const msgErro = document.getElementById('erro-busca');

    if (!input) {
        carregarReceitas();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/receitas/chef/${encodeURIComponent(input)}`);
        if (!response.ok) throw new Error();

        if (msgErro) msgErro.classList.add('hidden');
        const receitas = await response.json();
        exibirReceitas(receitas);
    } catch (error) {
        if (msgErro) msgErro.classList.remove('hidden');
        document.getElementById('mural-receitas').innerHTML = '';
    }
}