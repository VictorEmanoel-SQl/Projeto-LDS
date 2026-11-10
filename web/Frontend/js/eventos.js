// Busca os eventos no backend (GET /eventos) e renderiza os cards na tela
async function carregarEventos() {
    const lista = document.getElementById('lista-eventos');
    const estadoVazio = document.querySelector('.estado-vazio');
    if (!lista) return;

    try {
        const resposta = await fetch('/eventos');
        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.success) {
            throw new Error(resultado.message || 'Falha ao buscar eventos.');
        }

        const eventos = resultado.eventos || [];
        lista.innerHTML = '';

        if (eventos.length === 0) {
            if (estadoVazio) estadoVazio.style.display = 'block';
            return;
        }

        if (estadoVazio) estadoVazio.style.display = 'none';

        eventos.forEach((ev) => {
            const card = document.createElement('article');
            card.className = 'evento-card';

            const img = document.createElement('img');
            img.src = ev.imagem_evento;
            img.alt = ev.titulo || 'Imagem do evento';
            card.appendChild(img);

            const info = document.createElement('div');
            info.className = 'evento-info';

            const titulo = document.createElement('h2');
            titulo.textContent = ev.titulo;
            info.appendChild(titulo);

            const dataFormatada = ev.data_evento
                ? new Date(ev.data_evento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                : '';

            const campos = [
                ['Categoria', ev.categoria],
                ['Organizador', ev.organizador],
                ['Data', `${dataFormatada} — ${ev.hora_inicio} às ${ev.hora_fim}`],
                ['Local', ev.local_eventos],
                ['Vagas', ev.numero_vagas],
                ['Descrição', ev.descricao]
            ];

            campos.forEach(([rotulo, valor]) => {
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                strong.textContent = `${rotulo}: `;
                p.appendChild(strong);
                p.appendChild(document.createTextNode(valor ?? ''));
                info.appendChild(p);
            });

            card.appendChild(info);
            lista.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao carregar eventos:', erro);
        if (estadoVazio) {
            estadoVazio.style.display = 'block';
            const p = estadoVazio.querySelector('p');
            if (p) p.textContent = 'ERRO AO CARREGAR OS EVENTOS';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    carregarEventos(); // carrega os eventos assim que a página abre

    // 1. Sistema de Pesquisa
    const inputPesquisa = document.querySelector('.pesquisa input');
    const btnPesquisa = document.querySelector('.pesquisa button');
    const criarevento = document.getElementById('criareventos');

    criarevento.addEventListener('click', () => {
        window.location.href = 'criareventos.html';
    });

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
        window.location.href = "login.html";
    }
}