document.addEventListener('DOMContentLoaded', () => {
    renderizarEventos();
    marcarEventosEncerrados();

    const botoes = document.querySelectorAll('.filtro-btn');
    const eventos = document.querySelectorAll('.evento-card');
    const semEventos = document.getElementById('sem-eventos');

    function aplicarFiltro(jogo) {
        let visiveis = 0;

        eventos.forEach((evento) => {
            const mostrar = jogo === 'todos' || evento.dataset.jogo === jogo || evento.dataset.jogo === 'geral';
            evento.style.display = mostrar ? '' : 'none';
            if (mostrar) visiveis++;
        });

        if (semEventos) {
            semEventos.style.display = visiveis === 0 ? 'block' : 'none';
        }
    }

    botoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoes.forEach((b) => b.classList.remove('active'));
            botao.classList.add('active');
            aplicarFiltro(botao.dataset.jogo);
        });
    });

    const botaoInicial = document.querySelector('.filtro-btn.active');
    aplicarFiltro(botaoInicial ? botaoInicial.dataset.jogo : 'todos');
});

// Renderiza os cards a partir do catálogo compartilhado em js/eventos-data.js
function renderizarEventos() {
    const grid = document.getElementById('eventos-grid');
    if (!grid || typeof EVENTOS === 'undefined') return;

    grid.innerHTML = EVENTOS.map((evento) => `
        <div class="card evento-card" data-jogo="${evento.jogo}"${evento.dataFim ? ` data-fim="${evento.dataFim}"` : ''}>
            ${evento.imagem ? `<img class="evento-imagem" src="${evento.imagem}" alt="${evento.alt}" loading="lazy">` : ''}
            <span class="evento-tag">${evento.tag}</span>
            <h3>${evento.titulo}</h3>
            <div class="evento-info">
                ${evento.data ? `<p class="evento-data">${evento.data}</p>` : ''}
                <p class="evento-local">${evento.local}</p>
            </div>
        </div>
    `).join('');
}

// Marca como "encerrado" (escurecido) todo .evento-card cujo data-fim (YYYY-MM-DD) já passou
function marcarEventosEncerrados() {
    const agora = new Date();

    document.querySelectorAll('.evento-card[data-fim]').forEach((card) => {
        const fimDoEvento = new Date(`${card.dataset.fim}T23:59:59`);
        if (agora > fimDoEvento) {
            card.classList.add('evento-encerrado');
        }
    });
}
