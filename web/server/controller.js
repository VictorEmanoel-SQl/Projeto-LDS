const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('./node_connectionBD');

router.post('/cadastrar', async (req, res) => {
  const { usuario, senha, email, genero } = req.body;

  if (!usuario || !senha || !email || !genero) {
    return res.status(400).send("Preencha todos os campos");
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const sql = "INSERT INTO usuarios (nome, senha, email, genero) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [usuario, hash, email, genero], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro no banco de dados");
      }
      res.send("Cadastro realizado com sucesso!");
    });

  } catch (error) {
    res.status(500).send("Erro no servidor");
  }
});

router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).send("Preencha todos os campos");
  }

  try {
    const sql = "SELECT * FROM usuarios WHERE nome = ?";
    
    db.query(sql, [usuario], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro no banco de dados");
      }

      if (results.length === 0) {
        return res.status(401).send("Usuário ou senha incorretos");
      }

      const user = results[0];

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (senhaValida) {
        res.json({ success: true, redirectTo: "/dashboard.html" });
      } else {
        res.json({ success: false, message: "Usuário ou senha incorretos" });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

module.exports = router;   