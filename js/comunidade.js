document.addEventListener('DOMContentLoaded', () => {
    renderizarEventosTeaser();

    const botoes = document.querySelectorAll('.filtros .filtro-btn');
    const cardsFiltraveis = document.querySelectorAll('.grupo-card, .criador-card');

    function aplicarFiltro(jogo) {
        cardsFiltraveis.forEach((card) => {
            const mostrar = jogo === 'todos' || card.dataset.jogo === jogo || card.dataset.jogo === 'geral';
            card.style.display = mostrar ? '' : 'none';
        });
    }

    botoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoes.forEach((b) => b.classList.remove('active'));
            botao.classList.add('active');
            aplicarFiltro(botao.dataset.jogo);
        });
    });

    const botaoInicial = document.querySelector('.filtros .filtro-btn.active');
    aplicarFiltro(botaoInicial ? botaoInicial.dataset.jogo : 'todos');
});

// Teaser com os próximos eventos confirmados, a partir do catálogo compartilhado
// em js/eventos-data.js (mesma fonte usada por torneios.html)
function renderizarEventosTeaser() {
    const grid = document.getElementById('eventos-teaser-grid');
    const semEventos = document.getElementById('sem-eventos-teaser');
    if (!grid || typeof EVENTOS === 'undefined') return;

    const agora = new Date();
    const proximos = EVENTOS
        .filter((evento) => evento.dataFim && new Date(`${evento.dataFim}T23:59:59`) >= agora)
        .sort((a, b) => new Date(a.dataFim) - new Date(b.dataFim))
        .slice(0, 3);

    grid.innerHTML = proximos.map((evento) => `
        <div class="card evento-teaser-card reveal">
            <span class="evento-tag">${evento.tag}</span>
            <h3>${evento.titulo}</h3>
            <p>${evento.descricao}</p>
        </div>
    `).join('');

    if (semEventos) {
        semEventos.style.display = proximos.length === 0 ? 'block' : 'none';
    }
}
