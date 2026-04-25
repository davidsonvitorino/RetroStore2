const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

const produto = produtos.find(p => p.id === id);

const container = document.getElementById('detalhe-produto');

if(!produto) {
    container.innerHTML = '<p>Produto não encontrado</p>'
} else {
    container.innerHTML = `
    <div class="card">
        <img src="${produto.img}" alt="${produto.nome}" style="width: 100%; max-width: 300px; display: block; margin: 0 auto;">
        <div class="card-content">
            <h2>Detalhe do Produto</h2>
            <h3>${produto.nome}</h3>
            <p><strong>Preço:</strong> R$ ${produto.preco}</p>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
            <a class="by-btn" href="https://wa.me/5531993333407?text=Tenho interesse no produto ${produto.nome}">Comprar pelo WhatsApp</a>
        </div>
    </div>
    `;

    const btnVoltar = document.getElementById('btn-voltar');
    if(btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.history.back();
        });
    }
}