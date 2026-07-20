document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    const campoTexto = document.getElementById('feedback-texto');
    const lista = document.getElementById('feedbacks-lista');
    const status = document.getElementById('feedback-status');

    if (!form || !lista) return;

    carregarFeedbacks();

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const texto = campoTexto.value.trim();
        if (!texto) return;

        const botao = form.querySelector('button[type="submit"]');
        botao.disabled = true;
        if (status) status.textContent = '';

        try {
            const resposta = await fetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto }),
            });

            if (!resposta.ok) throw new Error('Falha ao enviar');

            campoTexto.value = '';
            if (status) status.textContent = 'Obrigado pelo seu feedback!';
            carregarFeedbacks();
        } catch {
            if (status) status.textContent = 'Não foi possível enviar seu feedback agora. Tente novamente mais tarde.';
        } finally {
            botao.disabled = false;
        }
    });

    async function carregarFeedbacks() {
        try {
            const resposta = await fetch('/api/feedbacks');
            if (!resposta.ok) throw new Error('Falha ao carregar');
            renderizarFeedbacks(await resposta.json());
        } catch {
            renderizarMensagem('Não foi possível carregar os feedbacks no momento.');
        }
    }

    function renderizarMensagem(texto) {
        lista.replaceChildren();
        const aviso = document.createElement('p');
        aviso.className = 'feedbacks-vazio';
        aviso.textContent = texto;
        lista.appendChild(aviso);
    }

    function renderizarFeedbacks(feedbacks) {
        if (!feedbacks.length) {
            renderizarMensagem('Ainda não há feedbacks. Seja o primeiro a comprar e avaliar!');
            return;
        }

        const fragmento = document.createDocumentFragment();
        feedbacks.forEach((feedback) => fragmento.appendChild(criarItemFeedback(feedback)));
        lista.replaceChildren(fragmento);
    }

    function criarItemFeedback(feedback) {
        const item = document.createElement('div');
        item.className = 'card feedback-item';

        const data = document.createElement('span');
        data.className = 'feedback-data';
        data.textContent = formatarData(feedback.data);

        const texto = document.createElement('p');
        texto.textContent = feedback.texto; // textContent evita XSS de feedbacks maliciosos

        item.append(data, texto);
        return item;
    }

    function formatarData(isoString) {
        const data = new Date(isoString);
        if (Number.isNaN(data.getTime())) return '';
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
});
