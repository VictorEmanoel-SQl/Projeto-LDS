const formCadastro = document.getElementById('formCadastro');

async function processarCadastro() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const matricula = document.getElementById("matricula").value;
    const senha = document.getElementById("ocultar_senha").value;
    const confirmarSenha = document.getElementById("confirmar").value;

    const diaVal = document.getElementById("dia").value;
    const mesVal = document.getElementById("mes").value;
    const anoVal = document.getElementById("ano").value;
    const data_nascimento = `${anoVal}-${mesVal}-${diaVal}`;

    
    if (senha !== confirmarSenha) {
        const inputConfirmar = document.getElementById("confirmar");
        inputConfirmar.setCustomValidity("As senhas não estão iguais");
        inputConfirmar.reportValidity();
        return;
    }

    try {
        
        const response = await fetch("/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                matricula: matricula,
                senha: senha,
                data_nascimento: data_nascimento
            }),
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            alert(resultado.message); 
            window.location.href = "/"; 
        } else {
            alert("Erro: " + (resultado.message || "Não foi possível realizar o cadastro."));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de comunicação com o servidor.");
    }
}

if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); 
        processarCadastro();
    });
} else {
    console.error("Formulário de cadastro não encontrado na página.");
}