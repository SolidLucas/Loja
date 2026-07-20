// Servidor mínimo (só módulos nativos do Node, sem dependências) que serve o site
// estático do TCGBRASA e expõe a API de feedbacks de compradores.
//
// Como rodar:   node server/server.js
// Porta:        variável de ambiente PORT, padrão 3000

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const ARQUIVO_FEEDBACKS = path.join(DATA_DIR, 'feedbacks.txt');
const PORTA = process.env.PORT || 3000;

const TAMANHO_MAXIMO_FEEDBACK = 500;
const MAXIMO_FEEDBACKS_RETORNADOS = 200;
const LIMITE_CORPO_REQUISICAO = 10 * 1024; // 10KB — feedback é texto curto, não precisa de mais

const TIPOS_MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.avif': 'image/avif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

async function garantirArquivoDeFeedbacks() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
        await fs.access(ARQUIVO_FEEDBACKS);
    } catch {
        await fs.writeFile(ARQUIVO_FEEDBACKS, '', 'utf8');
    }
}

// Cada linha do .txt é um JSON compacto ({"data":"...","texto":"..."}), o que evita
// qualquer escaping manual de quebras de linha dentro do próprio texto do feedback.
async function lerFeedbacks() {
    const conteudo = await fs.readFile(ARQUIVO_FEEDBACKS, 'utf8');
    const linhas = conteudo.split('\n').filter(Boolean);

    const feedbacks = [];
    for (const linha of linhas) {
        try {
            feedbacks.push(JSON.parse(linha));
        } catch {
            // linha corrompida — ignora em vez de derrubar o endpoint inteiro
        }
    }

    feedbacks.reverse(); // mais recente primeiro
    return feedbacks.slice(0, MAXIMO_FEEDBACKS_RETORNADOS);
}

async function adicionarFeedback(texto) {
    const linha = `${JSON.stringify({ data: new Date().toISOString(), texto })}\n`;
    await fs.appendFile(ARQUIVO_FEEDBACKS, linha, 'utf8');
}

function sanitizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto.replace(/[\r\n\t]+/g, ' ').trim().slice(0, TAMANHO_MAXIMO_FEEDBACK);
}

function lerCorpoDaRequisicao(req) {
    return new Promise((resolve, reject) => {
        let tamanho = 0;
        const partes = [];

        req.on('data', (parte) => {
            tamanho += parte.length;
            if (tamanho > LIMITE_CORPO_REQUISICAO) {
                reject(new Error('corpo muito grande'));
                req.destroy();
                return;
            }
            partes.push(parte);
        });
        req.on('end', () => resolve(Buffer.concat(partes).toString('utf8')));
        req.on('error', reject);
    });
}

function responderJson(res, status, corpo) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(corpo));
}

async function tratarApiFeedbacks(req, res) {
    if (req.method === 'GET') {
        responderJson(res, 200, await lerFeedbacks());
        return;
    }

    if (req.method === 'POST') {
        let corpo;
        try {
            corpo = await lerCorpoDaRequisicao(req);
        } catch {
            responderJson(res, 413, { erro: 'Feedback muito grande.' });
            return;
        }

        let texto = '';
        try {
            texto = sanitizarTexto(JSON.parse(corpo).texto);
        } catch {
            texto = '';
        }

        if (!texto) {
            responderJson(res, 400, { erro: 'Feedback vazio.' });
            return;
        }

        await adicionarFeedback(texto);
        responderJson(res, 201, { ok: true });
        return;
    }

    responderJson(res, 405, { erro: 'Método não permitido.' });
}

async function servirArquivoEstatico(req, res) {
    const caminhoUrl = decodeURIComponent(req.url.split('?')[0]);
    const caminhoRelativo = caminhoUrl === '/' ? '/index.html' : caminhoUrl;
    const caminhoAbsoluto = path.normalize(path.join(ROOT_DIR, caminhoRelativo));

    // Impede path traversal (ex: /../server/server.js)
    if (!caminhoAbsoluto.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        res.end('Acesso negado');
        return;
    }

    try {
        const dados = await fs.readFile(caminhoAbsoluto);
        const extensao = path.extname(caminhoAbsoluto).toLowerCase();
        res.writeHead(200, { 'Content-Type': TIPOS_MIME[extensao] || 'application/octet-stream' });
        res.end(dados);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Não encontrado');
    }
}

const servidor = http.createServer((req, res) => {
    if (req.url.startsWith('/api/feedbacks')) {
        tratarApiFeedbacks(req, res).catch((erro) => {
            console.error(erro);
            responderJson(res, 500, { erro: 'Erro interno.' });
        });
        return;
    }

    servirArquivoEstatico(req, res).catch((erro) => {
        console.error(erro);
        res.writeHead(500);
        res.end('Erro interno');
    });
});

garantirArquivoDeFeedbacks().then(() => {
    servidor.listen(PORTA, () => {
        console.log(`TCGBRASA rodando em http://localhost:${PORTA}`);
    });
});
