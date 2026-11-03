const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const pastaUploads = path.join(__dirname, '..', 'uploads');

// Cria web/uploads, caso ainda não exista.
fs.mkdirSync(pastaUploads, { recursive: true });

const extensoes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaUploads);
    },

    filename: (req, file, cb) => {
        const nome = `${crypto.randomUUID()}${extensoes[file.mimetype]}`;
        cb(null, nome);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },

    fileFilter: (req, file, cb) => {
        if (extensoes[file.mimetype]) {
            return cb(null, true);
        }

        const erro = new Error('Use uma imagem JPG, PNG, WEBP ou GIF.');
        erro.code = 'FORMATO_IMAGEM_INVALIDO';
        return cb(erro);
    }
});

module.exports = { upload, pastaUploads };