const matricula = document.getElementById('matricula');
const senha = document.getElementById('senha');
const enviar = document.getElementById('enviar');
const mostrarSenha = document.getElementById('icone-senha');
const iconimg = document.querySelector('.icone-senha img');

mostrarSenha.addEventListener('click', function() {
    if (senha.type === 'password') {
        senha.type = 'text';
        iconimg.src = 'assets/icons/olhoaberto.svg';
    } else {
        senha.type = 'password';
        iconimg.src = 'assets/icons/olhofechado.svg';
    }
});

  const botao = document.getElementById('recuperacao-link');
  botao.onclick = function() {
    window.location.href = 'redefinirsenha.html';
  }

async function fazerLogin() {
    if (matricula.value === '' || senha.value === '') {
        alert("Preencha todos os campos");
        return;
    }

    

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matricula: matricula.value,
                senha: senha.value
            })
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            window.location.href = resultado.redirectTo;
        } else {
            alert("Erro: " + (resultado.message || "Falha ao realizar login"));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

enviar.addEventListener('click', function(event) {
    event.preventDefault();
    fazerLogin();
});

const criarConta = document.getElementById('criarConta');
criarConta.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = '/cadastro.html';
});

