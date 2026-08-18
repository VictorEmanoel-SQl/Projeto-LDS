
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

const controller = require('./controller');
app.use('/', controller);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});   