# BarberSync — Versão HTML e CSS

Este projeto é um **protótipo acadêmico estático**, feito para estudar e apresentar páginas de um site de barbearias.

## Tecnologias

- HTML5: estrutura de todas as páginas e formulários.
- CSS3: cores, cards, responsividade e filtro por bairro usando radio buttons.
- JavaScript: **não utilizado**. Não há arquivos `.js`, frameworks, bibliotecas ou geração dinâmica de HTML.

## Como abrir

Abra a pasta no VS Code. Clique duas vezes em `index.html` ou use a extensão Live Server. Você também pode publicar os arquivos diretamente na Vercel como site estático, sem comando de build.

## Páginas

| Arquivo | O que mostra |
| --- | --- |
| `index.html` | Página inicial, vitrine e filtro por bairro |
| `estacao47.html`, `nobre.html`, `distrito.html`, `vertice.html` | Perfis das quatro barbearias |
| `agendar.html` | Formulário visual de agendamento |
| `confirmacao.html` | Aviso de fim da demonstração |
| `cliente.html` e `cadastro-cliente.html` | Formulários demonstrativos de cliente |
| `conta.html` | Área de cliente ilustrativa |
| `barbeiro.html` e `cadastro-barbearia.html` | Formulários demonstrativos do proprietário |
| `painel.html` | Exemplo estático de agenda, faturamento, equipe e produtos |
| `planos.html` e `politicas.html` | Planos propostos e regras de uso |
| `style.css` | Todos os estilos, inclusive celular |

## Limites importantes

**Sem JavaScript nem backend, este site não faz login real, não salva contas, não grava agendamentos, não bloqueia horários ocupados, não altera pedidos ou produtos, e não possui pesquisa textual dinâmica.** A navegação funciona, os formulários demonstram seus campos e as áreas de cliente/barbeiro exibem dados ilustrativos.

Os formulários usam `action` e `method="get"` para navegar a uma página de exemplo. Assim, os campos podem aparecer na URL. **Use apenas dados fictícios, nunca informações pessoais reais.** Em uma versão real, seria necessário backend e HTTPS com autenticação segura.

## Como apresentar em grupo (5 integrantes)

1. **HTML da página inicial:** cabeçalho, cartões, links e filtros por bairro. Perguntas: como funciona um link? Para que serve `section`?
2. **CSS e responsividade:** Flexbox, Grid, media queries e filtro com radio buttons. Perguntas: diferença entre Grid e Flexbox? Como ajustar para celular?
3. **Perfis das barbearias:** fotos, profissionais, serviços e avaliações ilustrativas. Perguntas: como inserir imagens acessíveis? O que é uma classe CSS?
4. **Formulários de cliente e agendamento:** campos nativos, `required`, `select` e navegação. Perguntas: o que `required` valida? Por que os dados não são salvos?
5. **Painel e planos:** tabelas, informações, cards de planos e limitações. Perguntas: como foi construída a tabela? O que falta para o painel ser funcional?

## Testar antes da banca

- Clique nas quatro barbearias da vitrine.
- Selecione cada bairro no filtro.
- Abra o formulário e navegue até a tela de demonstração.
- Abra cliente, barbeiro, cadastro, painel, planos e políticas.
- Confira o layout pelo DevTools em celular (390px) e desktop.
- Confirme que não há arquivos JS nem referências a scripts.

A simplificação para HTML/CSS foi solicitada como prioridade. O resultado é um **site visual de demonstração**, não a mesma aplicação funcional que existia antes.
