document.addEventListener('DOMContentLoaded', () => {
    marcarEventosEncerrados();

    const botoes = document.querySelectorAll('.filtro-btn');
    const eventos = document.querySelectorAll('.evento-card');
    const semEventos = document.getElementById('sem-eventos');

    botoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoes.forEach((b) => b.classList.remove('active'));
            botao.classList.add('active');

            const jogo = botao.dataset.jogo;
            let visiveis = 0;

            eventos.forEach((evento) => {
                const mostrar = jogo === 'todos' || evento.dataset.jogo === jogo || evento.dataset.jogo === 'geral';
                evento.style.display = mostrar ? '' : 'none';
                if (mostrar) visiveis++;
            });

            if (semEventos) {
                semEventos.style.display = visiveis === 0 ? 'block' : 'none';
            }
        });
    });
});

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
