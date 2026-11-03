const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const db = require('./node_connectionBD');
const { upload } = require('./upload');
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
                    if (err.sqlMessage && err.sqlMessage.includes('matricula')) {
                        return res.status(409).json({ success: false, message: "Esta matrícula já está registada." });
                    }
                    if (err.sqlMessage && err.sqlMessage.includes('email')) {
                        return res.status(409).json({ success: false, message: "Este email já está registado." });
                    }
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

//uploads

// Cadastro de evento com imagem
router.post('/eventos', upload.single('imagem'), (req, res) => {
    const {
        titulo,
        categoria,
        organizador,
        data_evento,
        hora_inicio,
        hora_fim,
        local_eventos,
        numero_vagas,
        descricao
    } = req.body;

    function removerImagem() {
        if (req.file) {
            fs.unlink(req.file.path, (erro) => {
                if (erro) console.error('Erro ao remover imagem:', erro);
            });
        }
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Envie a imagem do evento.'
        });
    }

    const campos = [
        titulo, categoria, organizador, data_evento,
        hora_inicio, hora_fim, local_eventos,
        numero_vagas, descricao
    ];

    const vagas = Number(numero_vagas);

    if (
        campos.some(valor => !String(valor ?? '').trim()) ||
        !Number.isInteger(vagas) ||
        vagas < 1
    ) {
        removerImagem();

        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos e informe vagas como inteiro positivo.'
        });
    }

    const imagem_evento = `/uploads/${req.file.filename}`;

    const sql = `
        INSERT INTO eventos (
            titulo, imagem_evento, categoria, organizador,
            data_evento, hora_inicio, hora_fim,
            local_eventos, numero_vagas, descricao
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        titulo, imagem_evento, categoria, organizador,
        data_evento, hora_inicio, hora_fim,
        local_eventos, vagas, descricao
    ];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error(err);
            removerImagem();

            return res.status(500).json({
                success: false,
                message: 'Erro ao salvar o evento no banco.'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Evento cadastrado com sucesso!',
            id: result.insertId,
            imagem_evento
        });
    });
});

// Listagem dos eventos
router.get('/eventos', (req, res) => {
    const sql = `
        SELECT id, titulo, imagem_evento, categoria, organizador,
               data_evento, hora_inicio, hora_fim,
               local_eventos, numero_vagas, descricao
        FROM eventos
        ORDER BY data_evento DESC, hora_inicio DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar eventos.'
            });
        }

        return res.json({
            success: true,
            eventos: rows
        });
    });
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

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.code === 'LIMIT_FILE_SIZE'
                ? 'A imagem deve ter no máximo 5 MB.'
                : 'Erro no upload: ' + err.message
        });
    }

    if (err.code === 'FORMATO_IMAGEM_INVALIDO') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    return next(err);
});

module.exports = router;
