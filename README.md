# BarberSync — HTML, CSS e JavaScript básico

Protótipo acadêmico de site de barbearias. A estrutura e a aparência continuam em **15 páginas HTML e um CSS**. O site utiliza **um único arquivo JS** (`app.js`, cerca de 255 linhas) para os recursos que precisam guardar dados.

## Funcionalidades

- Home com quatro barbearias demonstrativas e filtro por bairro feito somente com HTML e CSS.
- Cadastro e login de clientes com dados fictícios.
- Cadastro e login de proprietários; novos estabelecimentos aparecem na vitrine do mesmo navegador.
- Agendamento por barbearia, profissional, dia e hora; bloqueio de horários ocupados naquele navegador.
- Área do cliente com histórico e cancelamento de reservas.
- Painel do proprietário com os agendamentos da própria barbearia.
- Botão de tema claro/escuro presente em todas as páginas; preferência salva.

## Muito importante: limitação acadêmica

**Não existe backend ou banco de dados.** O JavaScript usa `localStorage` para guardar as informações neste navegador e `sessionStorage` para indicar quem entrou nesta aba.

- Outro aparelho/navegador não compartilha os dados e pode escolher o mesmo horário.
- Nenhuma barbearia recebe reservas reais.
- **Senhas demonstrativas são armazenadas em texto simples.** Nunca use credenciais, nomes ou telefones reais. Não é um sistema de autenticação segura.
- Produtos, avaliações e faturamento ainda são conteúdos ilustrativos.

## Testar

Abra `index.html` pelo Live Server do VS Code ou pelo site publicado na Vercel.

**Cliente:** acesse `cliente.html` com usuário `cliente` e senha `demo123`, ou crie uma conta em `cadastro-cliente.html`. Entre em uma barbearia, agende e veja em `conta.html`. Teste também cancelar um horário.

**Proprietário:** acesse `barbeiro.html` com `estacao47` / `demo123` e veja `painel.html`. Ou crie outra barbearia em `cadastro-barbearia.html` e confira a vitrine inicial.

**Tema:** clique em Modo escuro / Modo claro no menu. Navegue e confira se a escolha permanece.

## Explicação para o professor

- **HTML:** cabeçalho, páginas, campos, cards e tabela.
- **CSS:** cores, layout responsivo, filtro por bairro e tema visual.
- **JavaScript:** cadastro local, login demonstrativo, horários, cancelamento e botão de tema.

`app.js` está dividido com comentários numerados para facilitar sua apresentação. É uma simulação local, não uma aplicação comercial.

## Simulador em cada barbearia

As quatro páginas de perfil (`estacao47.html`, `nobre.html`, `distrito.html` e `vertice.html`) têm uma **prévia visual em HTML** com serviço, profissional, data e horário. Essa prévia não necessita de JavaScript. O botão **Continuar agendamento** abre `agendar.html` com a barbearia correta selecionada; a escolha de data e horário é refeita na tela seguinte, onde o `app.js` registra a reserva local.

Na banca: abra qualquer perfil, mostre os quatro campos e clique em **Continuar agendamento**. Explique que a prévia é uma interface HTML e que o salvamento ocorre na página separada.
