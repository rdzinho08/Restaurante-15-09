
const usuariosBD = [
    { email: "comum@dominio.com", senha: "123", nome: "Usuário Comum", tipo: "comum", avatar: "/anexos_prova/imagens_usuarios/chef1.jpg" },
    { email: "exemplo@dominio.com", senha: "123", nome: "Chef1", tipo: "chef", handle: "chef1", avatar: "/anexos_prova/imagens_usuarios/chef3.jpg" }
];

let receitasBD = [
    { id: 1, titulo: "Receita 1", chef: "chef1", foto: "/anexos_prova/receitas/receita1.jpg", favoritos: 0, favoritadosPorMim: [] },
    { id: 2, titulo: "Receita 2", chef: "chef1", foto: "/anexos_prova/receitas/receita2.jpg", favoritos: 0, favoritadosPorMim: [] },
    { id: 3, titulo: "Receita 3", chef: "chef1", foto: "/anexos_prova/receitas/receita3.jpg", favoritos: 0, favoritadosPorMim: [] },
    { id: 4, titulo: "Receita 4", chef: "chef2", foto: "/anexos_prova/receitas/receita4.jpg", favoritos: 0, favoritadosPorMim: [] },
    { id: 5, titulo: "Receita 5", chef: "chef2", foto: "/anexos_prova/receitas/receita5.jpg", favoritos: 0, favoritadosPorMim: [] }
];

let usuarioLogado = null;

document.addEventListener("DOMContentLoaded", () => {
    renderizarMural(receitasBD);
});


function abrirModalLogin() {
    limparErrosLogin();
    document.getElementById('authModal').showModal();
}

function fecharModalLogin() {
    document.getElementById('authModal').close();
}

function limparErrosLogin() {
    document.getElementById('erro-email').classList.add('hidden');
    document.getElementById('erro-senha').classList.add('hidden');
    document.getElementById('erro-login-geral').classList.add('hidden');
}


function realizarLogin(event) {
    event.preventDefault();
    limparErrosLogin();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    let valido = true;

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('erro-email').classList.remove('hidden');
        valido = false;
    }

  
    if (!senha) {
        document.getElementById('erro-senha').classList.remove('hidden');
        valido = false;
    }

    if (!valido) return;

   
    const user = usuariosBD.find(u => u.email === email && u.senha === senha);

    if (user) {
        usuarioLogado = user;
        atualizarInterfaceUsuarioLogado();
        fecharModalLogin();
    } else {
        document.getElementById('erro-login-geral').classList.remove('hidden');
    }
}

function atualizarInterfaceUsuarioLogado() {
    document.getElementById('user-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').src = usuarioLogado.avatar;

    
    const btnPerfil = document.getElementById('btn-perfil');
    if (usuarioLogado.tipo === "chef") {
        btnPerfil.removeAttribute('disabled');
    } else {
        btnPerfil.setAttribute('disabled', 'true');
    }

    document.getElementById('btlogin').classList.add('hidden');
    document.getElementById('btlogout').classList.remove('hidden');
}


function fazerLogout() {
    usuarioLogado = null;
    window.location.reload();
}


function abrirMenuLateral() {
    if (!usuarioLogado || usuarioLogado.tipo !== "chef") return;

    const receitasDoChef = receitasBD.filter(r => r.chef === usuarioLogado.handle);
    const totalFavs = receitasDoChef.reduce((acc, r) => acc + r.favoritos, 0);

    document.getElementById('total-favoritos').innerText = totalFavs;
    document.getElementById('total-receitas').innerText = receitasDoChef.length;

    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay-sidebar').classList.add('active');
}

function fecharMenuLateral() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay-sidebar').classList.remove('active');
}

function carregarSuasReceitas() {
    fecharMenuLateral();
    const minhasReceitas = receitasBD.filter(r => r.chef === usuarioLogado.handle);
    renderizarMural(minhasReceitas);
}


function buscarChef() {
    const termo = document.getElementById('input-busca').value.trim().toLowerCase();
    const erroElemento = document.getElementById('erro-busca');

    if (!termo) {
        renderizarMural(receitasBD);
        erroElemento.classList.add('hidden');
        return;
    }

    const receitasEncontradas = receitasBD.filter(r => r.chef.toLowerCase() === termo);

    if (receitasEncontradas.length === 0) {
        erroElemento.classList.remove('hidden');
    } else {
        erroElemento.classList.add('hidden');
        renderizarMural(receitasEncontradas);
    }
}


function renderizarMural(listaReceitas) {
    const mural = document.getElementById('mural-receitas');
    mural.innerHTML = "";

    listaReceitas.forEach(receita => {
        const jaFavoritou = usuarioLogado && receita.favoritadosPorMim.includes(usuarioLogado.email);
        
        // Favoritada: #F6A823 (Laranja) | Não favoritada: #1B3C29 (Verde)
        const corEstrela = jaFavoritou ? "#F6A823" : "#1B3C29";

        const card = document.createElement('div');
        card.className = 'card-receita';
        card.innerHTML = `
            <img src="${receita.foto}" alt="${receita.titulo}" class="foto-receita">
            <div class="card-info">
                <h3>${receita.titulo}</h3>
                <div class="favoritos" onclick="alternarFavorito(${receita.id})">
                    <svg class="icone-estrela" viewBox="0 0 24 24" fill="${corEstrela}">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span style="color: ${corEstrela}">${receita.favoritos}</span>
                </div>
            </div>
        `;
        mural.appendChild(card);
    });
}

function alternarFavorito(receitaId) {
    if (!usuarioLogado) {
        abrirModalLogin();
        return;
    }

    const receita = receitasBD.find(r => r.id === receitaId);
    const indexFav = receita.favoritadosPorMim.indexOf(usuarioLogado.email);

    if (indexFav === -1) {
        receita.favoritadosPorMim.push(usuarioLogado.email);
        receita.favoritos += 1;
    } else {
        receita.favoritadosPorMim.splice(indexFav, 1);
        receita.favoritos -= 1;
    }

    buscarChef();
}