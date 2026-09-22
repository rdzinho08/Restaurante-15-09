const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT id_usuario, nome, nome_usuario, email, imagem_usuario, tipo FROM tb_usuario WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado ou senha incorreta' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.get('/receitas/chef/:nome_usuario', async (req, res) => {
  const { nome_usuario } = req.params;
  try {
    const query = `
      SELECT r.id_receita, r.titulo_receita, r.origem_receita, r.url_imagem, r.id_usuario, u.nome_usuario, u.nome,
             COUNT(f.id_favorito)::int AS favoritos
      FROM tb_receita r
      JOIN tb_usuario u ON r.id_usuario = u.id_usuario
      LEFT JOIN tb_favoritar f ON r.id_receita = f.id_receita
      WHERE (LOWER(u.nome_usuario) LIKE LOWER($1) OR LOWER(u.nome) LIKE LOWER($1))
      GROUP BY r.id_receita, u.nome_usuario, u.nome
      ORDER BY r.id_receita ASC;
    `;
    const result = await pool.query(query, [`%${nome_usuario}%`]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Chef não encontrado' });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});