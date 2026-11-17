# Guia rápido para explicar o código no VS Code

## Abrir e apresentar

Abra a pasta no VS Code e inicie `index.html` com o **Live Server** (ou visite a versão da Vercel). Se abrir o arquivo com duplo clique, o carregamento dos modelos HTML por `fetch` poderá falhar.

## Onde procurar cada parte

| Funcionalidade | Arquivo | Pesquise por |
| --- | --- | --- |
| Menu e estrutura | `index.html` | `nav-links`, `id="app"` |
| Página inicial e filtros | `templates/01-paginas.html`, `js/02-telas.js` | `pagina-inicio-vitrine`, `telaInicio` |
| Dados das barbearias | `js/01-dados.js` | `EXEMPLOS` |
| Cadastro e login | `templates/01-paginas.html`, `js/05-formularios.js` | `form-login`, `form-cadastro-cliente` |
| Perfil e formulário de reserva | `templates/01-paginas.html` | `pagina-perfil-barbearia`, `form-agendar` |
| Regras dos horários | `js/01-dados.js` | `horariosLivres` |
| Registrar agendamento | `js/05-formularios.js` | `form-agendar` |
| Área do proprietário | `templates/02-painel.html`, `js/02-telas.js` | `telaPainel`, `painel-agenda` |
| Guardar os dados | `js/01-dados.js` | `salvar` |
| Cancelar e concluir | `js/04-interacoes.js` | `data-cancelar`, `data-concluir` |
| Trocar de página | `js/03-navegacao.js` | `renderizar` |
| Visual e responsividade | `css/` | `.shop-card`, `@media` |

## Perguntas comuns

**Por que o HTML das telas está separado?** Para deixar a estrutura das páginas no HTML em vez de colocar grandes textos HTML dentro do JavaScript. A função `htmlTela()` substitui os marcadores pelos dados.

**Para que serve `#painel` na URL?** É uma rota simples. Ao mudar a parte depois de `#`, `renderizar()` mostra a página correspondente.

**O login é seguro?** Não. É um login fictício de demonstração. Um sistema real exigiria servidor e autenticação adequada.

**Uma reserva aparece em outro celular?** Não. Os registros ficam no `localStorage` daquele navegador.

## Roteiro de estudo

1. Mostre no HTML os campos de `form-agendar`.
2. Localize o envio do formulário em `js/05-formularios.js`.
3. Explique os horários livres em `js/01-dados.js`.
4. Mostre `salvar()` e depois a agenda do proprietário.

Também há guias em `docs/GUIA-HTML-TCC.md` e `docs/ESTUDO-CSS.md`.
