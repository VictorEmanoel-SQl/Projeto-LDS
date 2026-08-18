const login = document.getElementById('usuario');
const senha = document.getElementById('senha');
const enviar = document.getElementById('enviar');

async function fazerLogin() {
    if (login.value === '' || senha.value === '') {
        alert("Preencha todos os campos");
    } else {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: login.value,
                    senha: senha.value
                })
            });

            const resultado = await response.json();

            if (response.ok && resultado.success) {
                window.location.href = resultado.redirectTo;
            } else {
                alert("Erro: " + resultado.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor.");
        }
    }
}

enviar.addEventListener('click', function(event) {
    event.preventDefault();
    fazerLogin();
});