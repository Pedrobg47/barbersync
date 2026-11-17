# Como estudar e apresentar o CSS do BarberSync

O arquivo `style.css` carrega os outros arquivos com `@import`. **O navegador lê os estilos na ordem indicada.** Você não precisa mexer no `index.html`: ele continua incluindo apenas `style.css`.

## Organização

| Arquivo | O que explicar |
| --- | --- |
| `css/01-geral.css` | Cores, fonte, regras gerais, menu e botões |
| `css/02-inicio-e-vitrine.css` | Banner inicial, filtros e cards das barbearias |
| `css/03-barbearias.css` | Fotos, serviços, profissionais e área de agendamento |
| `css/04-painel-e-responsivo.css` | Estrutura do painel, tabelas e adaptação para celular |
| `css/05-cadastros.css` | Formulários de login, cadastro e base do modo escuro |
| `css/06-tema.css` | Cores azul-marinho/dourado e variações de aparência |
| `css/07-componentes.css` | Planos, avaliações, produtos e detalhes complementares |

## Conceitos importantes para a apresentação

- **Seletor:** identifica o elemento. Ex.: `.shop-card` estiliza o card de uma barbearia.
- **Propriedade:** o que é alterado. Ex.: `background`, `padding`, `color`, `display`.
- **Classe:** atributo de um elemento HTML que permite aplicar estilos a vários elementos.
- **Flexbox e Grid:** organizam elementos em linhas e colunas. Estão em `.nav`, `.cards` e `.dashboard`.
- **`@media`:** adapta o layout ao celular e ao tablet.
- **`:hover`:** muda a aparência ao passar o mouse sobre um elemento.
- **Variáveis de cor:** as cores principais são definidas em `:root` no arquivo `01-geral.css`; o modo escuro altera algumas variáveis em `05-cadastros.css`.

## Demonstração rápida para a banca

1. Abra `index.html` e mostre a ligação com `style.css`.
2. Mostre os `@import` dentro do `style.css`.
3. Abra `02-inicio-e-vitrine.css`, busque `.shop-card` e explique fundo, borda e espaçamento.
4. Abra `03-barbearias.css`, busque `.booking` e explique o formulário lateral de agendamento.
5. Abra `04-painel-e-responsivo.css`, busque `@media` e explique como o layout se adapta a telas pequenas.

Não é necessário decorar todo o CSS. O importante é entender um exemplo de cada conceito e conseguir localizar a parte do site correspondente.
