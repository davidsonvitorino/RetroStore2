// Upload de Imagem
const multer = require('multer');
const path = require('path');

// Importa o Express (criar servidor)
const express = require('express');

// Importa o CORS (liberar acesso do frontend)
const cors = require('cors');

// Importa o MySQL (conectar com banco)
const mysql = require('mysql2');

// ================= CONFIGURAÇÃO DE UPLOAD =================

// Define onde salvar e como nomear a imagem
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'uploads/'); // pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const nomeUnico = Date.now() + path.extname(file.originalname);
        cb(null, nomeUnico); // nome único para evitar conflitos
    }
});

const upload = multer({ storage });


// ================= CONFIGURAÇÃO DO APP =================
const app = express();

// Libera acesso do HTML (evita erro CORS)
app.use(cors());

// Permite receber JSON do frontend
app.use(express.json());

// Permite acessar as imagens pelo navegador
app.use('/uploads', express.static('uploads'));

// ================= CONEXÃO COM MYSQL =================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'retrostore'
});

// Teste de conexão (opcional mas importante)
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
  } else {
    console.log('MySQL conectado ✅');
  }
});

// LISTAR PRODUTOS (BANCO REAL)
app.get('/produtos', (req, res) => {

    const { categoria } = req.query;

    let sql = 'SELECT * FROM produtos';
    let valores = [];

    // se tiver categoria, filtra
    if (categoria && categoria !== 'todos') {
        sql += ' WHERE categoria = ?';
        valores.push(categoria);
    }

    // Faz consulta no banco
    db.query(sql, valores, (err, results) => { 
        if (err) {
            console.error('ERRO SQL:',err);
            return res.status(500).send('Erro no banco');
        }

        // Retorna os dados em formato JSON
        res.json(results);
    });
});

// ADICIONAR PRODUTO COM IMAGEM (BANCO REAL)
// Recebe dados do frontend
app.post('/produtos', upload.single('imagem'), (req, res) => {
    // Pega dados enviados pelo HTML
    const { nome, preco, categoria, descricao } = req.body;

    const imagem = req.file ? req.file.filename : null;

    if (!nome || !preco || !imagem || !descricao) {
        return res.status(400).send('Preencha todos os campos');
    }

    // Salva no banco
    db.query(
        'INSERT INTO produtos (nome, preco, imagem, categoria, descricao) VALUES (?, ?, ?, ?, ?)', 
        [nome, preco, imagem, categoria, descricao], // valores substituem os ?
        (err) => {

            console.log('DESCRIÇÃO RECEBIDA:', descricao);

            if (err) {
                console.error(err);
                return res.status(500).send('Erro no banco');
            }

            res.send('Produtos salvo');
        }
    );
});

// ✏️ ATUALIZAR PRODUTO
app.put('/produtos/:id', (req, res) => {

    const id = Number(req.params.id);
    const { nome, preco } = req.body;

    console.log('Dados recebidos:', nome, preco, id);

    db.query(
        'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
        [nome, preco, id],
        (err, result) => {

            if (err) {
                console.error('Erro SQL:',err);
                return res.status(500).send('Erro ao atualizar');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Produto não encontrado');
            }

            res.json({ mensagem: 'Produto atualizado' });
        }
    );
});

// EXCLUIR PRODUTO
app.delete('/produtos/:id', (req, res) => {

    const id = req.params.id;  //pega o id da URL

    db.query(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao excluir');
            }

            res.send('Produto excluído');
        }
    );
});

// ================= INICIAR SERVIDOR =================

// Liga o servidor na porta 3000
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

