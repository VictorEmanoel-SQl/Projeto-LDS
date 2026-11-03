const dados = new FormData(form);                  // pega texto + arquivo de uma vez
const resposta = await fetch('/eventos', { method: 'POST', body: dados });