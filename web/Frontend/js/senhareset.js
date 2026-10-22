console.log("senhareset.js carregado com sucesso!");

// Restringe a entrada de matrícula apenas para números (máximo 20 dígitos)
document.addEventListener('DOMContentLoaded', () => {
    const inputMatricula = document.getElementById('matricula');
    if (inputMatricula) {
        inputMatricula.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
        });
    }
});

function senha() {
    const inputSenha = document.getElementById('novaSenha');
    if (!inputSenha) return;

    const valor = inputSenha.value;
    const elEspecial = document.getElementById('simboloEspecial');
    const elMaiuscula = document.getElementById('letraMaiuscula');
    const elQuantidade = document.getElementById('quantidade');

    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    const temMaiuscula = /[A-Z]/;
    const temTamanhoMinimo = valor.length >= 8;

    if (elEspecial) elEspecial.classList.toggle('requisito-ok', temEspecial.test(valor));
    if (elMaiuscula) elMaiuscula.classList.toggle('requisito-ok', temMaiuscula.test(valor));
    if (elQuantidade) elQuantidade.classList.toggle('requisito-ok', temTamanhoMinimo);
}

function mostrarSenha(idInput, idOlho) {
    const input = document.getElementById(idInput);
    const olho = document.getElementById(idOlho);

    if (!input || !olho) return;
    if (input.type === 'password') {
        input.type = 'text';
        olho.textContent = '.';
    } else {
        input.type = 'password';
        olho.textContent = '◉';
    }
}

async function salvarSenha(event) {
    if (event) event.preventDefault(); 

    const inputMatricula = document.getElementById('matricula');
    const inputNova = document.getElementById('novaSenha');
    const inputConfirmar = document.getElementById('confirmarSenha');

    if (!inputMatricula || !inputNova || !inputConfirmar) {
        alert("Erro no formulário: Campos de entrada não foram encontrados.");
        return;
    }

    const matricula = inputMatricula.value.trim();
    const novaSenha = inputNova.value;
    const confirmarSenha = inputConfirmar.value;

    if (matricula.length !== 8 || !/^\d{8}$/.test(matricula)) {
        alert("ERRO: A matrícula deve conter exatamente 8 dígitos numéricos.");
        return;
    }

    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    const temMaiuscula = /[A-Z]/;
    const temTamanhoMinimo = novaSenha.length >= 8;

    if (!temTamanhoMinimo) {
        alert("ERRO: A senha precisa ter no mínimo 8 caracteres!");
        return;
    }

    if (!temMaiuscula.test(novaSenha)) {
        alert("ERRO: A senha precisa ter pelo menos uma letra maiúscula (A - Z)!");
        return;
    }

    if (!temEspecial.test(novaSenha)) {
        alert("ERRO: A senha precisa ter pelo menos um caractere especial (@ $ % !)!");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert("ERRO: As senhas não coincidem. Digite novamente.");
        return;
    }

    try {
        const response = await fetch('/reset-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matricula: matricula,
                novaSenha: novaSenha
            })
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            alert(resultado.message);
            window.location.href = '/';
        } else {
            alert("Erro: " + (resultado.message || "Não foi possível redefinir a senha."));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de comunicação com o servidor.");
    }
}

function voltarInicio() {
    window.location.href = 'login.html';
}