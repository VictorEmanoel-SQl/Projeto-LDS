document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sistema de Pesquisa
    const inputPesquisa = document.querySelector('.pesquisa input');
    const btnPesquisa = document.querySelector('.pesquisa button');

    function executarPesquisa() {
        const termo = inputPesquisa.value.trim();
        if (termo !== "") {
            console.log(`Buscando por: ${termo}`);
        }
    }

    if (btnPesquisa && inputPesquisa) {
        btnPesquisa.addEventListener('click', executarPesquisa);
        inputPesquisa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executarPesquisa();
            }
        });
    }

    // 2. Navegação do Menu Lateral (SPA / Troca dinâmica de conteúdo na mesma página)
    const menuLinks = document.querySelectorAll('.menu nav a');
    const tituloPagina = document.querySelector('.conteudo h1');
    const textoEstadoVazio = document.querySelector('.estado-vazio p');

    // Configuração dos textos para cada aba
    const conteudosAbas = {
        "Eventos": {
            titulo: "Eventos mais recentes",
            vazio: "NÃO HÁ NENHUM EVENTO"
        },
        "Meus eventos": {
            titulo: "Meus eventos criados",
            vazio: "VOCÊ AINDA NÃO CRIOU NENHUM EVENTO"
        },
        "Minhas inscrições": {
            titulo: "Minhas inscrições",
            vazio: "VOCÊ NÃO ESTÁ INSCRITO EM NENHUM EVENTO"
        },
        "Meus certificados": {
            titulo: "Meus certificados",
            vazio: "VOCÊ AINDA NÃO POSSUI CERTIFICADOS"
        }
    };

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evita recarregar a página

            // Remove a classe 'ativo' de todos e adiciona no clicado
            menuLinks.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');

            // Identifica qual aba foi clicada com base no texto
            const textoCompleto = link.textContent.trim();
            let chaveAba = "Eventos";

            if (textoCompleto.includes("Meus eventos")) chaveAba = "Meus eventos";
            else if (textoCompleto.includes("Minhas inscrições")) chaveAba = "Minhas inscrições";
            else if (textoCompleto.includes("Meus certificados")) chaveAba = "Meus certificados";

            // Altera o título e a mensagem de estado vazio dinamicamente
            if (conteudosAbas[chaveAba]) {
                if (tituloPagina) tituloPagina.textContent = conteudosAbas[chaveAba].titulo;
                if (textoEstadoVazio) textoEstadoVazio.textContent = conteudosAbas[chaveAba].vazio;
            }
        });
    });

    // 3. Comportamento dinâmico do Botão "Voltar ao Topo"
    const btnVoltarTopo = document.querySelector('.voltar-topo');

    if (btnVoltarTopo) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 250) {
                btnVoltarTopo.style.display = 'block';
            } else {
                btnVoltarTopo.style.display = 'none';
            }
        });

        // Oculta o botão se já carregar a página no topo
        if (window.scrollY <= 250) {
            btnVoltarTopo.style.display = 'none';
        }
    }

});

// 4. CÓDIGO DO MODAL EXATO QUE VOCÊ ENVIOU
function abrirPerfil() {
    const modal = document.getElementById("modalPerfil");
    modal.style.display = "flex";
}

function fecharPerfil() {
    const modal = document.getElementById("modalPerfil");
    modal.style.display = "none";
}

function fecharPerfilFora(event) {
    if (event.target.id === "modalPerfil") {
        fecharPerfil();
    }
}

document.addEventListener("keydown", function(event) {    
    if (event.key === "Escape") {
        fecharPerfil();
    }
});

function sair() {
    const confirmar = confirm("Deseja realmente sair?");
    if (confirmar) {
        window.location.href = "index.html";
    }
}