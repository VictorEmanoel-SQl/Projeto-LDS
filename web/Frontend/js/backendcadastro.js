
const btnMostrarSenha = document.getElementById("mostrar-senha");
const inputSenha = document.getElementById("ocultar_senha");

if (btnMostrarSenha && inputSenha) {
    btnMostrarSenha.addEventListener("click", () => {
        if (inputSenha.type === "password") {
            inputSenha.type = "text";
            btnMostrarSenha.setAttribute("aria-label", "Ocultar senha");
        } else {
            inputSenha.type = "password";
            btnMostrarSenha.setAttribute("aria-label", "Mostrar senha");
        }
    });
}


const btnMostrarConfirmar = document.getElementById("mostrar-confirmar");
const inputConfirmar = document.getElementById("confirmar");

if (btnMostrarConfirmar && inputConfirmar) {
    btnMostrarConfirmar.addEventListener("click", () => {
        if (inputConfirmar.type === "password") {
            inputConfirmar.type = "text";
            btnMostrarConfirmar.setAttribute("aria-label", "Ocultar senha");
        } else {
            inputConfirmar.type = "password";
            btnMostrarConfirmar.setAttribute("aria-label", "Mostrar senha");
        }
    });
}


const matricula = document.getElementById("matricula");
if (matricula) {
    matricula.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
    });
}


const dia = document.getElementById("dia");
const mes = document.getElementById("mes");
const ano = document.getElementById("ano");

function ano_bissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

function validarEFormatadorData() {
    if (dia) dia.value = dia.value.replace(/\D/g, "");
    if (mes) mes.value = mes.value.replace(/\D/g, "");
    if (ano) ano.value = ano.value.replace(/\D/g, "");

    const mesvalor = parseInt(mes.value, 10);
    const anovalor = parseInt(ano.value, 10);

    if (mesvalor > 12) mes.value = "12";

    if (ano.value.length === 4 && !isNaN(anovalor)) {
        if (anovalor < 1900) {
            ano.setCustomValidity("Ano não permitido. O ano mínimo é 1900.");
        } else {
            ano.setCustomValidity("");
        }
    } else {
        ano.setCustomValidity("");
    }

    let max_dias = 31;
    if (mesvalor) {
        if (mesvalor === 2) {
            if (ano.value.length === 4 && !isNaN(anovalor)) {
                max_dias = ano_bissexto(anovalor) ? 29 : 28;
            } else {
                max_dias = 29;
            }
        } else if ([4, 6, 9, 11].includes(mesvalor)) {
            max_dias = 30;
        }
    }

    if (parseInt(dia.value, 10) > max_dias) {
        dia.value = max_dias.toString();
    }
}

if (dia && mes && ano) {
    dia.addEventListener("input", validarEFormatadorData);
    mes.addEventListener("input", validarEFormatadorData);
    ano.addEventListener("input", validarEFormatadorData);
    ano.addEventListener("blur", () => {
        if (!ano.checkValidity()) ano.reportValidity();
    });
}


if (inputSenha && inputConfirmar) {
    inputSenha.addEventListener("input", () => inputConfirmar.setCustomValidity(""));
    inputConfirmar.addEventListener("input", () => inputConfirmar.setCustomValidity(""));
}