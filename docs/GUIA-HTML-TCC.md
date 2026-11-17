# Guia do HTML — BarberSync

O arquivo `index.html` contém a **estrutura principal do site**: cabeçalho, menu, área de conteúdo (`<main id="app">`), rodapé e avisos.

As telas ficam separadas em quatro arquivos HTML:

| Arquivo | O que contém |
|---|---|
| `templates/01-paginas.html` | Página inicial, login, cadastro, perfil da barbearia, planos e políticas |
| `templates/02-painel.html` | Abas da área do barbeiro: agenda, faturamento, avaliações, fotos e produtos |
| `templates/03-componentes.html` | Elementos reutilizados: cards, tabelas, botões e campos |
| `templates/04-janelas.html` | Formulários e mensagens que aparecem em janelas |

## Como as telas aparecem?

1. O navegador abre `index.html` e carrega `js/app.js`.
2. A função `carregarModelosHTML()` busca os quatro arquivos da pasta `templates/`.
3. A função `htmlTela(id, valores)` encontra um modelo e substitui os marcadores `__BS_VAL_0__`, `__BS_VAL_1__` etc. pelos dados.
4. A função `renderizar()` identifica a rota, como `#inicio` ou `#painel`, e apresenta a tela no `<main id="app">`.

## O que apresentar no VS Code

- **Cabeçalho e navegação:** `index.html` → `<header>` e `<nav>`.
- **Página inicial:** `templates/01-paginas.html` → `id="pagina-inicio-vitrine"`.
- **Agendamento:** `templates/01-paginas.html` → `id="pagina-perfil-barbearia"` e `<form id="form-agendar">`.
- **Painel do barbeiro:** `templates/02-painel.html` → `id="painel-visao-geral"` ou `id="painel-agenda"`.
- **Card da vitrine:** `templates/03-componentes.html` → `id="componente-card-vitrine"`.
- **Confirmação do agendamento:** `templates/04-janelas.html` → `id="modal-agendamento-confirmado"`.

Os arquivos contêm modelos HTML com marcadores, e não quatro páginas independentes. O sistema é um protótipo com dados guardados no navegador.

**Para abrir no notebook:** use o site publicado na Vercel ou, no VS Code, instale a extensão **Live Server**, clique com o botão direito no `index.html` e selecione **Open with Live Server**. Abrir diretamente como `file://` não carrega os arquivos de modelos porque os navegadores normalmente bloqueiam `fetch` em arquivos locais.

Para testar o login de barbeiro: usuário `estacao47`, senha `demo123` (somente demonstração).
