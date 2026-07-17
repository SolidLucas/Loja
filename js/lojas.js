document.addEventListener('DOMContentLoaded', () => {
    const categoriaTiles = document.querySelectorAll('.categoria-tile');
    const grupoSubcategorias = document.querySelectorAll('.subcategorias');
    const produtos = document.querySelectorAll('.produto-card');
    const semProdutos = document.getElementById('sem-produtos');

    let categoriaAtiva = 'pokemon';
    let subcategoriaAtiva = 'todos';

    categoriaTiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            categoriaTiles.forEach((t) => t.classList.remove('active'));
            tile.classList.add('active');

            categoriaAtiva = tile.dataset.categoria;
            subcategoriaAtiva = 'todos';

            grupoSubcategorias.forEach((grupo) => {
                const ativo = grupo.dataset.categoria === categoriaAtiva;
                grupo.hidden = !ativo;
                if (ativo) {
                    grupo.querySelectorAll('.filtro-btn').forEach((b, indice) => {
                        b.classList.toggle('active', indice === 0);
                    });
                    subcategoriaAtiva = grupo.querySelector('.filtro-btn').dataset.subcategoria;
                }
            });

            aplicarFiltro();
        });
    });

    grupoSubcategorias.forEach((grupo) => {
        grupo.querySelectorAll('.filtro-btn').forEach((botao) => {
            botao.addEventListener('click', () => {
                grupo.querySelectorAll('.filtro-btn').forEach((b) => b.classList.remove('active'));
                botao.classList.add('active');
                subcategoriaAtiva = botao.dataset.subcategoria;
                aplicarFiltro();
            });
        });
    });

    function aplicarFiltro() {
        let visiveis = 0;

        produtos.forEach((produto) => {
            const passaCategoria = produto.dataset.categoria === categoriaAtiva;
            const passaSubcategoria = subcategoriaAtiva === 'todos' || produto.dataset.subcategoria === subcategoriaAtiva;
            const mostrar = passaCategoria && passaSubcategoria;

            produto.style.display = mostrar ? '' : 'none';
            if (mostrar) visiveis++;
        });

        if (semProdutos) {
            semProdutos.style.display = visiveis === 0 ? 'block' : 'none';
        }
    }

    grupoSubcategorias.forEach((grupo) => {
        grupo.hidden = grupo.dataset.categoria !== categoriaAtiva;
    });

    aplicarFiltro();

    document.querySelectorAll('a.produto-cta[href^="#"]').forEach((link) => {
        link.addEventListener('click', (evento) => {
            const id = link.getAttribute('href').slice(1);
            const alvo = document.getElementById(id);
            if (!alvo) return;

            evento.preventDefault();
            rolarSuavementeAte(alvo);
        });
    });
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
