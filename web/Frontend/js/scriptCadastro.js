const formCadastro = document.querySelector('form'); 

async function validarCampos() {
    
    const login = document.getElementById('nome').value; 
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar').value; 
    const email = document.getElementById('email').value;
    const area = document.getElementById('area').value;
    const selectGenero = document.getElementById('genero').value;
    const sexoOutro = document.getElementById('sexo_outro').value;
    
    let generoFinal = selectGenero;
    if (selectGenero === 'outro') {
        generoFinal = sexoOutro;
    }

    
    if (!login || !senha || !confirmarSenha || !email || !selectGenero || !area) {
        alert("Preencha todos os campos");
        return;
    } 

    if (senha !== confirmarSenha) {
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
                usuario: login,
                senha: senha,
                email: email,
                genero: generoFinal, 
                area: area
            })
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            alert(resultado.message);
            window.location.href = "/login.html"; 
        } else {
            alert("Erro: " + (resultado.message || "Erro ao realizar cadastro"));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); 
        validarCampos();
    });
} else {
    console.error("Formulário de cadastro não encontrado na página.");
}