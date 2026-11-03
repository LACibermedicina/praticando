# radIA.M3D — pacote de instalação

Rádio online em que agentes de IA são os apresentadores, com carrossel 3D de estações, estúdio 3D com mesa e microfone, vozes por avatar, painel administrativo, contas com níveis de acesso, equipe, moderação com log, flashcards e debates, skins de avatar, bandeja estilo macOS e interface em 5 idiomas.

## Instalação rápida (recomendada)

Requisito: [Node.js](https://nodejs.org) 18 ou superior.

- **Linux / macOS:** `./start.sh`
- **Windows:** dê dois cliques em `start.bat`
- **Qualquer sistema:** `node server.js`

Abra **http://localhost:8080**. Para mudar a porta: `PORT=3000 node server.js`.

Nessa forma o app grava tudo em `data/db.json` (estações, usuários, histórico, presença), compartilhado entre todos os navegadores que acessarem o servidor, e aparece como **instalável**: no Chrome ou Edge, ícone de instalar na barra de endereço; no iPhone, Compartilhar > Adicionar à Tela de Início.

## Outras formas

- **Docker:** `docker compose up -d` (os dados ficam em `./data`).
- **Só abrir o arquivo:** abra `index.html` no navegador. Funciona sem servidor, mas guarda os dados só naquele navegador, precisa de internet para o three.js e não instala como app.
- **Sem Node.js:** `start.sh` e `start.bat` usam `python -m http.server 8080` se houver Python. É o mesmo modo do arquivo aberto direto: sem banco compartilhado.

## Primeiro acesso

Superusuário padrão: **root** / **arcano**. Troque a senha antes de usar de verdade:

    node set-root-password.js SUA_NOVA_SENHA

Depois recarregue a página com Ctrl+F5. O root cria usuários, promove, suspende, silencia, limita estações, escreve ordens de conduta e vê o histórico no botão do escudo.

## Conteúdo do pacote

- `index.html` — o app completo
- `server.js` — servidor estático e banco JSON, sem dependências
- `db-shim.js` — liga o app ao banco do servidor
- `manifest.webmanifest`, `sw.js`, `icon-*.png`, `icon.svg` — instalação como app
- `set-root-password.js` — troca a senha do root
- `Dockerfile`, `docker-compose.yml`, `package.json`, `start.sh`, `start.bat`
- `vendor/three.min.js` — baixado automaticamente na primeira execução com internet, para funcionar offline depois
- `data/` — onde fica o banco (`db.json`). Faça backup desta pasta.

## O que muda fora da plataforma original

- **Tradução por IA:** só existe na plataforma onde o app foi criado. No pacote, a interface traduz os textos fixos já cadastrados (português, inglês, espanhol, chinês e guarani parcial), mas as falas dos avatares ficam em português.
- **Falas dos agentes:** continuam sendo geradas por modelos de texto prontos, não por um modelo de IA em tempo real.
- **Vozes:** usam as vozes que o seu navegador e sistema oferecem. O reconhecimento de voz pede permissão do microfone e costuma funcionar no Chrome e no Edge.

## Segurança — leia antes de publicar na internet

- O login é verificado no navegador. O servidor não autentica ninguém: quem alcançar a porta pode ler e gravar no banco. Use em rede confiável, ou publique atrás de um proxy com HTTPS e autenticação (por exemplo Nginx com senha ou Cloudflare Access).
- As senhas ficam como hash, mas qualquer pessoa com acesso ao banco lê esses hashes.
- Altere a senha do root e faça backup de `data/db.json`.
