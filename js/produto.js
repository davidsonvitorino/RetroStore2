const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`http://192.168.18.10:3000/produtos`)
    .then(res => res.json())
    .then(produtos => {

        const produto = produtos.find(p => p.id == id);
        const container = document.getElementById('detalhe-produto');

        if (!produto) {
            container.innerHTML = '<p>Produto não encontrado</p>';
            return;
        }

        container.innerHTML = `
        <div class="card">
            <img src="http://192.168.18.10:3000/uploads/${produto.imagem}" style="width:100%; max-width:300px; display:block; margin:auto;">
            
            <div class="card-content">
                <h2>${produto.nome}</h2>
                <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                <p><strong>Categoria:</strong> ${produto.categoria}</p>
                <p><strong>Descrição:</strong> ${produto.descricao}</p>
            </div>
        </div>
        `;
    });