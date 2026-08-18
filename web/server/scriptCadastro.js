const login = document.getElementById('usuario');
const senha = document.getElementById('senha');
const confirmarSenha = document.getElementById('confirmar-senha');
const email = document.getElementById('email');
const enviar = document.getElementById('enviar');
const generos = document.getElementById('generos');

async function validarCampos() {
    if (login.value === '' || senha.value === '' || confirmarSenha.value === '' || email.value === '' || generos.value === '') {
        alert("Preencha todos os campos");
        return;
    } 
    if (senha.value !== confirmarSenha.value) {
        alert("As senhas não coincidem");
        return;
    }

        try {
            const response = await fetch('/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: login.value,
                    senha: senha.value,
                    email: email.value,
                    genero: generos.value
                })
            });
            const resultado = await response.text();
    if (senha.value !== confirmarSenha.value) {
        alert("As senhas não coincidem");
        return;
        }
            if (response.ok) {
                alert(resultado);
                window.location.href = "/login.html";
            } else {
                alert("Erro: " + resultado.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor.");
        }
    }


enviar.addEventListener('click', function(event) {
    event.preventDefault();
    validarCampos();
});