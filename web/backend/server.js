
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../Frontend')));

const controller = require('./controller');
app.use('/', controller);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});