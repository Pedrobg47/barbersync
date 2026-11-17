# BarberSync

Projeto acadêmico de Front-end feito com HTML, CSS e JavaScript puro. Mostra barbearias, serviços, agendamentos e um painel com dados de demonstração.

## Abrindo no VS Code

1. Baixe a pasta do GitHub e abra no VS Code.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
4. Use o endereço local aberto pela extensão.

**Atenção:** abrir `index.html` diretamente por duplo clique (`file://`) não funciona nesta versão. Os HTMLs da pasta `templates/` são carregados com `fetch` e precisam de um servidor local, como Live Server, ou de uma hospedagem como a Vercel.

## Arquivos do projeto

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Cabeçalho, menu, área principal e rodapé |
| `templates/01-paginas.html` | Vitrine, perfil, login, cadastro, conta, planos e políticas |
| `templates/02-painel.html` | Área do proprietário |
| `templates/03-componentes.html` | Cards, tabelas e campos usados em várias telas |
| `templates/04-janelas.html` | Janelas de confirmação, avaliação e pedidos |
| `style.css` e `css/` | Cores, espaçamento, layout e responsividade |
| `js/01-dados.js` | Dados de exemplo, armazenamento e horários disponíveis |
| `js/02-telas.js` | Conteúdo das telas e do painel |
| `js/03-navegacao.js` | Troca de páginas e fotos |
| `js/04-interacoes.js` | Cliques, filtros e botões |
| `js/05-formularios.js` | Envio dos formulários, validações e agendamentos |
| `docs/` | Guias para estudar e apresentar o código |

## Como funciona o agendamento

1. A pessoa escolhe barbearia, serviço, profissional, dia e hora.
2. `horariosLivres()` consulta as reservas do **mesmo navegador**.
3. Ao enviar `form-agendar`, o programa verifica novamente a disponibilidade.
4. `salvar()` tenta registrar a reserva no `localStorage`; a confirmação só aparece depois.
5. O proprietário consulta os registros no painel dessa mesma instalação do navegador.

A estrutura das páginas fica em HTML. A função `htmlTela()` preenche marcadores como `__BS_VAL_0__` com os dados que mudam. Os arquivos JS são carregados na ordem do `index.html` porque compartilham variáveis e funções.

## Limitações (importante na apresentação)

- **Não há backend, banco de dados ou sincronização entre dispositivos.**
- O `localStorage` salva dados apenas neste navegador.
- O `sessionStorage` guarda a sessão demonstrativa, mas **não oferece autenticação segura**.
- As senhas são de teste e não devem ser senhas reais.
- Pagamentos, faturamento e reservas são demonstrações, não serviços de produção.
- Imagens externas precisam de internet. Fotos adicionadas pelo usuário ocupam o espaço local disponível.

Para testar a estrutura dos arquivos, rode `node tests/estrutura.mjs` na pasta do projeto (opcional; requer Node.js).

Para preparar a apresentação, veja `docs/GUIA-VSCODE-TCC.md` e `docs/ROTEIRO-APRESENTACAO-TCC.md`.
