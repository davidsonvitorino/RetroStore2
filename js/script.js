
// ================= VARIÁVEIS GLOBAIS =================
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let indexEditando = null;
const SENHA_ADMIN = '1234';

// ================= FUNÇÕES DE PERSISTÊNCIA =================
// Salva os produtos no localStorage
function salvar() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Renderiza todos os produtos na tela
function renderizar() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    produtos.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
        <img src="${prod.img}" class="link-produto" data-id="${prod.id}">
        <div class="card-content">
            <h3 class="link-produto" data-id="${prod.id}">${prod.nome}</h3>
            <p>R$ ${prod.preco}</p>
            <p><strong>Categoria:</strong> ${prod.categoria}</p>
            <a class="btn" href="https://wa.me/55993333407?text=Tenho interesse em ${prod.nome}">Comprar</a>
            <button class="btn" onclick="remover(${index})">Excluir</button>
            <button class="btn" onclick="editarProduto(${index})">Editar</button>
        </div>
        `;
        // Evento para abrir detalhes ao clicar na imagem ou nome
        card.querySelectorAll('.link-produto').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                window.location.href = `produto.html?id=${id}`;
            });
        });
        lista.appendChild(card);
    });
}

// Adiciona um novo produto à lista
function adicionarProduto() {
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const file = document.getElementById('imagem').files[0];
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;

    // Validação dos campos
    if (!nome || !preco || !file || !categoria || !descricao) {
        alert('Preencha todos os campos');
        return;
    }

    // Lê a imagem e salva o produto
    const reader = new FileReader();
    reader.onload = function(e) {
        produtos.push({
            id: Date.now(),
            nome: nome,
            preco: preco,
            categoria: categoria,
            img: e.target.result,
            descricao: descricao
        });
        salvar();
        renderizar();
        mostrarMensagem('Produto salvo com sucesso!');
    };
    reader.readAsDataURL(file);

    // Limpa os campos do formulário
    document.getElementById('nome').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('imagem').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('descricao').value = '';
}

// Remove um produto da lista
function remover(index) {
    const confirmar = confirm('Tem certeza que deseja excluir este produto?');
    if (!confirmar) return;
    produtos.splice(index, 1);
    salvar();
    renderizar();
    mostrarMensagem('Produto removido');
}

// Preenche o formulário com os dados do produto para edição
function editarProduto(index) {
    const produto = produtos[index];
    document.getElementById('nome').focus();
    document.getElementById('nome').value = produto.nome;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('categoria').value = produto.categoria;
    document.getElementById('descricao').value = produto.descricao || '';
    indexEditando = index;
    // Abre o formulário (modo admin)
    document.getElementById('form-admin').style.display = 'block';
    document.getElementById('btn-admin').textContent = 'Fechar Admin';
}


renderizar();

// Filtra produtos pela categoria selecionada
function filtrarProdutos(categoria) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    let produtosFiltrados = [];
    if (categoria === 'todos') {
        produtosFiltrados = produtos;
    } else {
        produtosFiltrados = produtos.filter(prod => prod.categoria && prod.categoria.toLowerCase() === categoria.toLowerCase());
    }
    produtosFiltrados.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
        <img src="${prod.img}" class="link-produto" data-id="${prod.id}">
        <div class="card-content">
            <h3 class="link-produto" data-id="${prod.id}">${prod.nome}</h3>
            <p>R$ ${prod.preco}</p>
            <p><strong>Categoria:</strong> ${prod.categoria}</p>
            <a class="btn" href="https://wa.me/55993333407?text=Tenho interesse em ${prod.nome}">Comprar</a>
            <button class="btn" onclick="remover(${index})">Excluir</button>
            <button class="btn" onclick="editarProduto(${index})">Editar</button>
        </div>
        `;
        // Evento para abrir detalhes ao clicar na imagem ou nome
        card.querySelectorAll('.link-produto').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                window.location.href = `produto.html?id=${id}`;
            });
        });
        lista.appendChild(card);
    });
}


const btnAdmin = document.getElementById('btn-admin');
const formAdmin = document.getElementById('form-admin');
const modalSenha = document.getElementById('modal-senha');
const inputSenhaAdmin = document.getElementById('input-senha-admin');
const btnConfirmarSenha = document.getElementById('btn-confirmar-senha');
const btnCancelarSenha = document.getElementById('btn-cancelar-senha');
const msgSenhaAdmin = document.getElementById('msg-senha-admin');

btnAdmin.addEventListener('click', () => {
    if (formAdmin.style.display === 'block') {
        formAdmin.style.display = 'none';
        btnAdmin.textContent = 'Modo Admin';
        return;
    }
    // Exibe o modal de senha
    modalSenha.style.display = 'flex';
    inputSenhaAdmin.value = '';
    msgSenhaAdmin.style.display = 'none';
    inputSenhaAdmin.focus();
});

btnConfirmarSenha.addEventListener('click', () => {
    if (inputSenhaAdmin.value === SENHA_ADMIN) {
        modalSenha.style.display = 'none';
        formAdmin.style.display = 'block';
        btnAdmin.textContent = 'Fechar Admin';
        document.getElementById('nome').focus();
    } else {
        msgSenhaAdmin.style.display = 'block';
    }
});

btnCancelarSenha.addEventListener('click', () => {
    modalSenha.style.display = 'none';
});

inputSenhaAdmin.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        btnConfirmarSenha.click();
    }
});

// Exibe uma mensagem temporária na tela
function mostrarMensagem(texto) {
    const msg = document.createElement('div');
    msg.className = 'mensagem-sucesso';
    msg.textContent = texto;
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.remove();
    }, 2500);
}