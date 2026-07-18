document.addEventListener('DOMContentLoaded', () => {
    renderizarCriadores();
});

// Renderiza o criador em destaque (a partir de js/criadores-data.js) e, caso existam
// outros criadores cadastrados, uma grade secundária abaixo dele.
function renderizarCriadores() {
    const destaqueEl = document.getElementById('criador-destaque');
    const grid = document.getElementById('criadores-grid');
    if (!destaqueEl || typeof CRIADORES === 'undefined' || CRIADORES.length === 0) return;

    const destaque = CRIADORES.find((criador) => criador.destaque) || CRIADORES[0];
    const outros = CRIADORES.filter((criador) => criador !== destaque);

    destaqueEl.innerHTML = `
        <span class="criador-destaque-selo">Criador em destaque</span>
        <div class="criador-destaque-icone">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 7l9 5-9 5V7z"/></svg>
        </div>
        <div class="criador-destaque-texto">
            <h3>${destaque.nome}</h3>
            <span class="criador-plataforma">${destaque.plataforma}</span>
            <p>${destaque.descricao}</p>
            <a class="criador-destaque-cta" href="${destaque.link}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 7l9 5-9 5V7z"/></svg>
                Ver canal
            </a>
        </div>
    `;

    if (grid) {
        grid.hidden = outros.length === 0;
        grid.innerHTML = outros.map((criador) => `
            <a class="card criador-card-secundario reveal" href="${criador.link}" target="_blank" rel="noopener">
                <span class="criador-plataforma">${criador.plataforma}</span>
                <h3>${criador.nome}</h3>
                <p>${criador.descricao}</p>
            </a>
        `).join('');
    }
}
