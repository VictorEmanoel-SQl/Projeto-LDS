document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEvento');

    if (!form) {
        console.error('Formulário de criação de evento não encontrado na página.');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // impede o submit nativo do formulário

        const arquivoImagem = document.getElementById('imagem').files[0];

        if (!arquivoImagem) {
            alert('Envie a imagem do evento.');
            return;
        }

        // ATENÇÃO: os nomes aqui DEVEM ser iguais aos que o backend espera em req.body
        // (titulo, categoria, organizador, data_evento, hora_inicio, hora_fim,
        //  local_eventos, numero_vagas, descricao) e o arquivo deve se chamar "imagem"
        const dados = new FormData();
        dados.append('imagem', arquivoImagem);
        dados.append('titulo', document.getElementById('titulo').value.trim());
        dados.append('categoria', document.getElementById('categoria').value.trim());
        dados.append('organizador', document.getElementById('organizador').value.trim());
        dados.append('data_evento', document.getElementById('data').value);      // type="date" -> AAAA-MM-DD
        dados.append('hora_inicio', document.getElementById('inicio').value);    // type="time" -> HH:MM
        dados.append('hora_fim', document.getElementById('finaliza').value);
        dados.append('local_eventos', document.getElementById('local').value.trim());
        dados.append('numero_vagas', document.getElementById('vagas').value);
        dados.append('descricao', document.getElementById('descricao').value.trim());

        try {
            // NÃO colocar header 'Content-Type': o navegador define
            // multipart/form-data com o boundary automaticamente
            const resposta = await fetch('/eventos', {
                method: 'POST',
                body: dados
            });

            const resultado = await resposta.json();

            if (resposta.ok && resultado.success) {
                alert(resultado.message);
                window.location.href = 'eventos.html';
            } else {
                alert('Erro: ' + (resultado.message || 'Não foi possível cadastrar o evento.'));
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
});
