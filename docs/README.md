# BarberSync

Projeto demonstrativo de plataforma para barbearias em Barueri, desenvolvido com HTML, CSS e JavaScript puro.

## Como abrir

Baixe o ZIP pelo GitHub, extraia a pasta e abra `index.html` no navegador. Para estudar o código, abra a pasta inteira no VS Code.

## Principais arquivos

- `index.html` — cabeçalho, rodapé e **modelos HTML das telas** (vitrine, perfil das barbearias, logins, cadastros, agendamentos e painel).
- `style.css` — identidade visual, layout e estilos, agrupados por seções.
- `js/app.js` — dados de exemplo, eventos, navegação, horários, formulários, validações e armazenamento local.
- `docs/` — guia de código e roteiros para apresentação.

## Como o HTML dinâmico funciona

O arquivo `index.html` utiliza blocos `<script type="text/html" id="pagina-inicio-vitrine">` e semelhantes para guardar o HTML das páginas. Apesar do nome `script`, o tipo `text/html` **não executa JavaScript**. A função `htmlTela()` do `js/app.js` lê esses blocos e insere os valores que mudam conforme o usuário e a barbearia. Assim o projeto roda diretamente no navegador, mesmo sem servidor local.

## Limitações reais

É um protótipo: utiliza `localStorage` e `sessionStorage` para guardar dados de teste. Não há banco de dados, servidor, autenticação segura, cobrança real ou sincronização entre computadores. Use somente dados fictícios.

Para estudar a divisão dos estilos, consulte `docs/ESTUDO-CSS.md`.
