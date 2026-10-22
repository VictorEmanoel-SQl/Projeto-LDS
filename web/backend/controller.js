const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('./node_connectionBD');

// Cadastro
router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, matricula, data_nascimento } = req.body;

    if (!nome || !email || !senha || !matricula || !data_nascimento) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos" });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);

        const sql = "INSERT INTO usuarios (nome, email, senha, matricula, data_nascimento) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [nome, email, hash, matricula, data_nascimento], (err, result) => {
            if (err) {
                console.error(err);
                
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: "Este email já está registado." });
                }
                return res.status(500).json({ success: false, message: "Erro na base de dados ao registar." });
            }
            return res.status(201).json({ success: true, message: "Cadastro realizado com sucesso!" });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro interno no servidor" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { matricula, senha } = req.body;

    if (!matricula || !senha) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos" });
    }

    try {
        const sql = "SELECT * FROM usuarios WHERE matricula = ?";
        
        db.query(sql, [matricula], async (err, results) => {
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

// Redefinição de Senha por Matrícula
router.post('/reset-senha', async (req, res) => {
    const { matricula, novaSenha } = req.body;

    if (!matricula || !novaSenha) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos." });
    }

    try {
        const hash = await bcrypt.hash(novaSenha, 10);

        const sql = "UPDATE usuarios SET senha = ? WHERE matricula = ?";

        db.query(sql, [hash, matricula], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Erro no banco de dados." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Matrícula não encontrada no sistema." });
            }

            return res.json({ success: true, message: "Senha redefinida com sucesso!" });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
});

module.exports = router;