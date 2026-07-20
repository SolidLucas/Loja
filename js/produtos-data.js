// Catálogo de produtos, compartilhado entre a Loja (catálogo completo, filtrável)
// e a Home (produtos em destaque), para não duplicar dados nem o template do card.
const PRODUTOS = [
    {
        categoria: 'pokemon',
        subcategoria: 'etb',
        colecao: 'Pokémon TCG',
        titulo: 'ETB Heróis Excelsos',
        imagem: 'img/produtos/etb-herois-excelsos.avif',
    },
    {
        categoria: 'pokemon',
        subcategoria: 'booster',
        colecao: 'Pokémon TCG',
        titulo: 'Blister Triplo Mega Evolução Equilíbrio Perfeito',
        imagem: 'img/produtos/blister-triplo-megaevolucao-equilibrio-perfeito.avif',
    },
    {
        categoria: 'lorcana',
        subcategoria: 'booster',
        colecao: 'Disney Lorcana',
        titulo: 'Booster Unitário Fabled',
        imagem: 'img/produtos/booster-unitario-fabled-lorcana.jpg',
    },
];

// ctaHref por padrão aponta para a âncora na própria página da Loja (rolagem suave via lojas.js);
// a Home passa 'lojas.html#grupo-whatsapp' para navegar até lá.
function criarCardProduto(produto, ctaHref = '#grupo-whatsapp') {
    const card = document.createElement('div');
    card.className = 'card produto-card';
    card.dataset.categoria = produto.categoria;
    card.dataset.subcategoria = produto.subcategoria;
    card.innerHTML = `
        <div class="produto-imagem">
            <img src="${produto.imagem}" alt="${produto.titulo}" loading="lazy">
        </div>
        <div class="produto-info">
            <span class="produto-colecao">${produto.colecao}</span>
            <h3>${produto.titulo}</h3>
            <div class="produto-rodape">
                <span class="produto-preco">Consulte o preço</span>
                <a class="produto-cta" href="${ctaHref}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    Comprar no WhatsApp
                </a>
            </div>
        </div>
    `;
    return card;
}
