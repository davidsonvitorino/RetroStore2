// ================= CONFIG =================
const API = 'http://localhost:3000/produtos';

// ================= CARREGAR PRODUTOS =================
function carregarProdutos() {
    fetch(API)
        .then(res => res.json())
        .then(produtos => {

            const lista = document.getElementById('lista');
            lista.innerHTML = '';

            produtos.forEach(prod => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <!-- Mostra imagem vindo do backend -->

                    <img src="http://localhost:3000/uploads/${prod.imagem}?t=${Date.now()}" width="120"/>
                    
                    <h3>${prod.nome}</h3>
                    <p>R$ ${prod.preco}</p>
                    <p>${prod.descricao}</p>

                    <button onclick="editar(${prod.id}, '${prod.nome}', '${prod.preco}')">Editar</button>

                    <button onclick="excluir(${prod.id})">Excluir</button>
                `;

                lista.appendChild(card);
            });
        })
        .catch(err => console.error('Erro ao carregar:', err));
}

// ================= ADMIN =================

const btnAdmin = document.getElementById('btn-admin');
const modalSenha = document.getElementById('modal-senha');
const btnConfirmarSenha = document.getElementById('btn-confirmar-senha');
const btnCancelarSenha = document.getElementById('btn-cancelar-senha');
const inputSenhaAdmin = document.getElementById('input-senha-admin');

const SENHA_ADMIN = '1234';

// Abrir modal
btnAdmin.addEventListener('click', () => {
    modalSenha.style.display = 'flex';
});

modalSenha.addEventListener('click', (e) => {
    if (e.target === modalSenha) {
        modalSenha.style.display = 'none';
    }
});

inputSenhaAdmin.addEventListener('keydown', (e) => {
    if (e.key ==='Enter') {
        btnConfirmarSenha.click();
    }
});

// Confirmar senha
btnConfirmarSenha.addEventListener('click', () => {
    if (inputSenhaAdmin.value === SENHA_ADMIN) {
        modalSenha.style.display = 'none';
        document.getElementById('form-admin').style.display = 'block';
    } else {
        alert('Senha incorreta');
    }
});

// Cancelar
btnCancelarSenha.addEventListener('click', () => {
    modalSenha.style.display = 'none';
});


// ================= ADICIONAR =================
function adicionarProduto() {

    // Pega os dados do formulário
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').files[0];
    const categoria = document.getElementById('categoriaSelect').value;
    const descricao = document.getElementById('descricao').value;

    // Cria um formulário especial para envio (FormData)
    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('imagem', imagem);
    formData.append('categoria', categoria);
    formData.append('descricao', descricao);
    // Envia para o backend (POST)
    fetch('http://localhost:3000/produtos', {
        method: 'POST',
        body: formData
    })
    .then(() => {
        alert('Produto salvo com imagem!');
        carregarProdutos(); // atualiza lista
    })

    .catch(err => console.error(err));
}

// ================= FILTRAR PRODUTOS =================
function filtrarProdutos(categoria) {

    fetch(`${API}?categoria=${categoria}`)
        .then(res => res.json())
        .then(produtos => {

            const lista = document.getElementById('lista');
            lista.innerHTML = '';

            produtos.forEach(prod => {
                const card = document.createElement('div');
                card.className = 'card';
            

            card.innerHTML = `
            <img src="http://localhost:3000/uploads/${prod.imagem}" width="120"/>
            <h3>${prod.nome}</h3>
            <p>R$ ${prod.preco}</p>
            
            <button onclick="editar(${prod.id}, '${prod.nome}', '${prod.preco}')">Editar</button>
            <button onclick="excluir(${prod.id})">Excluir</button>
            `;

            lista.appendChild(card);
        });

    });

}


// ================= EDITAR =================
function editar(id, nomeAtual, precoAtual) {

    const nome = prompt('Novo nome:', nomeAtual);
    const preco = prompt('Novo preço:', precoAtual);

    if (!nome || !preco) return;

    fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco })
    })
    .then(() => {
        mostrarMensagem('Atualizado!');
        carregarProdutos();
    });
}


// ================= EXCLUIR =================
function excluir(id) {

    const confirmar = confirm('Excluir produto?');
    if (!confirmar) return;

    fetch(`${API}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        mostrarMensagem('Excluído!');
        carregarProdutos();
    });
}


// ================= MENSAGEM =================
function mostrarMensagem(texto) {
    const msg = document.createElement('div');
    msg.className = 'mensagem';
    msg.innerText = texto;

    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), 2000);
}


// ================= INICIAR =================
carregarProdutos();