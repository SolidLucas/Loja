// Catálogo de produtos (PRODUTOS) e o template do card (criarCardProduto) vêm de
// js/produtos-data.js, compartilhado com a Home. Cada card só é criado no DOM quando
// sua categoria/subcategoria está selecionada, então imagens fora do filtro atual
// nunca chegam a ser baixadas.
document.addEventListener('DOMContentLoaded', () => {
    const categoriaTiles = document.querySelectorAll('.categoria-tile');
    const grupoSubcategorias = document.querySelectorAll('.subcategorias');
    const produtosGrid = document.getElementById('produtos-grid');
    const semProdutos = document.getElementById('sem-produtos');

    let categoriaAtiva = 'pokemon';
    let subcategoriaAtiva = 'todos';

    function grupoDaCategoria(categoria) {
        return document.querySelector(`.subcategorias[data-categoria="${categoria}"]`);
    }

    function subcategoriaPadrao(categoria) {
        const primeiroBotao = grupoDaCategoria(categoria)?.querySelector('.filtro-btn');
        return primeiroBotao ? primeiroBotao.dataset.subcategoria : 'todos';
    }

    // Estado inicial a partir da URL (?categoria=...&subcategoria=...), para sobreviver a um F5
    function estadoInicialDaUrl() {
        const params = new URLSearchParams(window.location.search);
        const categoriaParam = params.get('categoria');
        const categoriaValida = categoriaParam && document.querySelector(`.categoria-tile[data-categoria="${categoriaParam}"]`);
        const categoria = categoriaValida ? categoriaParam : 'pokemon';

        const subcategoriaParam = params.get('subcategoria');
        const grupo = grupoDaCategoria(categoria);
        const subcategoriaValida = subcategoriaParam && grupo?.querySelector(`.filtro-btn[data-subcategoria="${subcategoriaParam}"]`);
        const subcategoria = subcategoriaValida ? subcategoriaParam : subcategoriaPadrao(categoria);

        return { categoria, subcategoria };
    }

    function atualizarUrl() {
        const params = new URLSearchParams();
        params.set('categoria', categoriaAtiva);
        params.set('subcategoria', subcategoriaAtiva);
        const novaUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', novaUrl);
    }

    function sincronizarBotoes() {
        categoriaTiles.forEach((tile) => {
            tile.classList.toggle('active', tile.dataset.categoria === categoriaAtiva);
        });

        grupoSubcategorias.forEach((grupo) => {
            const ativo = grupo.dataset.categoria === categoriaAtiva;
            grupo.hidden = !ativo;
            if (ativo) {
                grupo.querySelectorAll('.filtro-btn').forEach((botao) => {
                    botao.classList.toggle('active', botao.dataset.subcategoria === subcategoriaAtiva);
                });
            }
        });
    }

    // Só renderiza os produtos da categoria/subcategoria ativas, em vez de manter
    // todo o catálogo no DOM e escondê-lo com display:none
    function renderizarProdutos() {
        const visiveis = PRODUTOS.filter((produto) => {
            const passaCategoria = produto.categoria === categoriaAtiva;
            const passaSubcategoria = subcategoriaAtiva === 'todos' || produto.subcategoria === subcategoriaAtiva;
            return passaCategoria && passaSubcategoria;
        });

        produtosGrid.replaceChildren(...visiveis.map((produto) => criarCardProduto(produto)));

        if (semProdutos) {
            semProdutos.style.display = visiveis.length === 0 ? 'block' : 'none';
        }
    }

    function aplicarFiltro() {
        sincronizarBotoes();
        atualizarUrl();
        renderizarProdutos();
    }

    categoriaTiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            categoriaAtiva = tile.dataset.categoria;
            subcategoriaAtiva = subcategoriaPadrao(categoriaAtiva);
            aplicarFiltro();
        });
    });

    grupoSubcategorias.forEach((grupo) => {
        grupo.querySelectorAll('.filtro-btn').forEach((botao) => {
            botao.addEventListener('click', () => {
                subcategoriaAtiva = botao.dataset.subcategoria;
                aplicarFiltro();
            });
        });
    });

    // Delegação de evento: os cards de produto são recriados a cada filtro,
    // então o listener de rolagem suave fica no container, não em cada card
    produtosGrid.addEventListener('click', (evento) => {
        const link = evento.target.closest('a.produto-cta[href^="#"]');
        if (!link) return;

        const alvo = document.getElementById(link.getAttribute('href').slice(1));
        if (!alvo) return;

        evento.preventDefault();
        rolarSuavementeAte(alvo);
    });

    const estadoInicial = estadoInicialDaUrl();
    categoriaAtiva = estadoInicial.categoria;
    subcategoriaAtiva = estadoInicial.subcategoria;
    aplicarFiltro();
});

// Rolagem suave com duração e easing próprios, mais lenta e gradual que o "scroll-behavior: smooth" padrão
function rolarSuavementeAte(elemento, duracaoMs = 900) {
    const alturaHeader = 90;
    const inicioY = window.scrollY;
    const destinoY = elemento.getBoundingClientRect().top + window.scrollY - alturaHeader;
    const distancia = destinoY - inicioY;
    const inicioTempo = performance.now();

    function facilitarEntradaSaida(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function passo(agora) {
        const decorrido = agora - inicioTempo;
        const progresso = Math.min(decorrido / duracaoMs, 1);
        window.scrollTo(0, inicioY + distancia * facilitarEntradaSaida(progresso));

        if (progresso < 1) {
            requestAnimationFrame(passo);
        }
    }

    requestAnimationFrame(passo);
}
