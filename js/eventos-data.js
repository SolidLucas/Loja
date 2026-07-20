// Catálogo de eventos, compartilhado entre torneios.html (lista completa) e
// comunidade.html (teaser dos próximos eventos), para não duplicar dados em dois lugares.
const EVENTOS = [
    {
        jogo: 'pokemon',
        tag: 'Pokémon',
        titulo: 'TCGCON',
        data: '12 e 13 de setembro de 2026',
        local: 'Av. Manuel Bandeira, 360 - Vila Leopoldina, São Paulo - SP',
        imagem: 'img/eventos/tcgcon.png',
        alt: 'Logo do TCGCON',
        dataFim: '2026-09-13',
    },
    {
        jogo: 'magic',
        tag: 'Magic',
        titulo: 'CommandFest',
        data: '31 de outubro e 01 de novembro de 2026',
        local: 'R. Luís Coelho, 323 - Consolação, São Paulo - SP',
        imagem: 'img/eventos/CommandFest.png',
        alt: 'Logo do CommandFest',
        dataFim: '2026-11-01',
    },
    {
        jogo: 'pokemon',
        tag: 'Pokémon',
        titulo: 'LAIC 2026',
        data: '20 a 22 de novembro de 2026',
        local: 'Local oficial a ser confirmado nos canais da Play! Pokémon.',
        imagem: 'img/eventos/laic.jpg',
        alt: 'Logo do LAIC 2026',
        dataFim: '2026-11-22',
    },
    {
        jogo: 'lorcana',
        tag: 'Lorcana',
        titulo: 'Disney Lorcana Challenge',
        data: null,
        local: 'À espera do próximo evento confirmado',
        imagem: 'img/eventos/lorcana-challenge.jpg',
        alt: 'Disney Lorcana Challenge',
        dataFim: null,
    },
];
