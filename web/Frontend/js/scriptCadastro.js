// web/Frontend/js/scriptCadastro.js

// 1. Select the form element instead of the button for better submission handling
const formCadastro = document.querySelector('form'); 

async function validarCampos() {
    // 2. Read values inside the function, AT THE MOMENT the user submits
    const login = document.getElementById('nome').value; // Changed ID to match HTML
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar').value; // Changed ID to match HTML
    const email = document.getElementById('email').value;
    const area = document.getElementById('area').value;
    const selectGenero = document.getElementById('genero').value;
    const sexoOutro = document.getElementById('sexo_outro').value;
    
    // Determine the final gender value
    let generoFinal = selectGenero;
    if (selectGenero === 'outro') {
        generoFinal = sexoOutro;
    }

    // 3. Validation checks
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
                genero: generoFinal, // Send the resolved gender value
                area: area
            })
        });

        const resultado = await response.json();

        if (response.ok && resultado.success) {
            alert(resultado.message);
            window.location.href = "/login.html"; // Make sure this page exists
        } else {
            alert("Erro: " + (resultado.message || "Erro ao realizar cadastro"));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

// 4. Attach event listener to the form's 'submit' event
if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents default page reload
        validarCampos();
    });
} else {
    console.error("Formulário de cadastro não encontrado na página.");
}