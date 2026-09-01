function Definirgenero() {
            const select = document.getElementById('genero');
            const divOutro = document.getElementById('div-outro');
            if (select.value === 'outro') {
                divOutro.style.display = 'block';
            } else {
                divOutro.style.display = 'none';
            }
        }
function mostrarSenha(id, botao) {
        const campo = document.getElementById(id);

        if (campo.type === "password") {
          campo.type = "text";
        } else {
          campo.type = "password";
        }
      }