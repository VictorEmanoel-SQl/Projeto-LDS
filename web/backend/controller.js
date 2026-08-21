const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('./node_connectionBD');

//Cadastro
router.post('/cadastrar', async (req, res) => {
    const { usuario, senha, email, genero, area } = req.body;

    if (!usuario || !senha || !email || !genero || !area) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos" });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);

        const sql = "INSERT INTO usuarios (nome, senha, email, genero, area) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [usuario, hash, email, genero, area], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Erro no banco de dados ao cadastrar" });
            }
            return res.status(201).json({ success: true, message: "Cadastro realizado com sucesso!" });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro interno no servidor" });
    }
});

//Login
router.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos" });
    }

    try {
        const sql = "SELECT * FROM usuarios WHERE nome = ?";
        
        db.query(sql, [usuario], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Erro no banco de dados" });
            }

            if (results.length === 0) {
                return res.status(401).json({ success: false, message: "Usuário ou senha incorretos" });
            }

            const user = results[0];
            const senhaValida = await bcrypt.compare(senha, user.senha);

            if (senhaValida) {
                return res.json({ success: true, redirectTo: "/dashboard.html" });
            } else {
                return res.status(401).json({ success: false, message: "Usuário ou senha incorretos" });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro interno no servidor" });
    }
});

module.exports = router;