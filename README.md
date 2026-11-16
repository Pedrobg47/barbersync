# BarberSync — Protótipo de TCC (front-end)

**BarberSync** é uma vitrine de barbearias de **Barueri (SP)**, onde o cliente pode escolher um local, ver fotos e avaliações ilustrativas, agendar atendimento e simular um pedido de produto. O dono acessa um painel separado, personaliza sua vitrine e consulta sua agenda e resultados.

> **Atenção:** este é um protótipo acadêmico de HTML, CSS e JavaScript puro. **Não há backend, banco de dados, API Google Maps, integração com Google Meu Negócio, autenticação real ou pagamento online.** Utilize apenas dados fictícios.

## Como abrir

1. Abra o arquivo `index.html` no navegador (ou publique a raiz deste repositório na Vercel como **Other**, sem comando de build).
2. Explore a vitrine, use os filtros e abra uma barbearia.
3. Clique em **Área do barbeiro** para testar o acesso do proprietário.
4. Para visualizar as imagens ilustrativas do Unsplash, o navegador precisa estar conectado à internet. As fotos enviadas pelo dono ficam no próprio navegador.

## Contas de login demonstrativas

| Usuário | Senha de demonstração | Barbearia |
| --- | --- | --- |
| `estacao47` | `demo123` | Estação 47 Barber |
| `nobre` | `demo123` | Nobre Barbearia |
| `distrito` | `demo123` | Distrito do Corte |
| `vertice` | `demo123` | Vértice Barber |

Cada conta **simula** o acesso à sua própria barbearia. Caso o dono cadastre uma nova barbearia pelo painel, ela também fica vinculada à mesma conta.

**Atenção à segurança:** os usuários e senhas estão escritos no JavaScript; portanto esse login **não é seguro e não protege dados reais**. Para um produto real, o login precisaria ser validado pelo servidor e usar autenticação segura. No TCC, a proposta é demonstrar a **tela e o fluxo de entrada**, sem fazer o módulo de backend.

## Estrutura simples para explicar aos professores

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | Esqueleto das páginas, logo, cabeçalho e botão do modo escuro |
| `style.css` | Cores, fontes, grade de fotos, responsividade, modo claro/escuro |
| `script.js` | Vitrine, formulários, filtros, login simulado, galeria, agenda e faturamento |
| `README.md` | Explicação do projeto |

Não é preciso instalar React, bibliotecas, Node.js ou banco de dados.

## O que é possível demonstrar

### Cliente
- Busca e filtros por nome, bairro, avaliações e preço.
- Perfil da barbearia com **foto de capa**, galeria de fotos, serviços, preços, profissionais com foto e avaliações.
- No cabeçalho do perfil aparece **o nome da barbearia à direita**, ao lado do pequeno logo **B**, que volta à página inicial.
- Agendamento com data, serviço e profissional, salvo apenas neste navegador.
- Avaliação fictícia e pedido simulado de produto.
- Botão para escolher **modo claro ou escuro**, com preferência lembrada no navegador.

### Proprietário
- Login demonstrativo em **Área do barbeiro**.
- Painel com agendamentos, avaliações, pedidos, personalização e produtos.
- Aba **Informações e cores**: nome, bairro, descrição, cor, texto de funcionamento e nomes dos profissionais.
- Aba **Fotos e equipe**: alterar imagem de fundo/capa, adicionar ou excluir fotos da galeria, enviar a foto de cada profissional.
- As imagens são reduzidas pelo JavaScript usando `canvas` e salvas em `localStorage` (sem upload para servidor). Formatos JPG, PNG e WebP; limite de 6 MB por arquivo, até 6 fotos na galeria.
- Aba **Agenda**: botão **Concluir** para registrar um atendimento concluído.
- Aba **Pedidos**: botão **Entregue** para finalizar um pedido fictício.
- Aba **Faturamento**: receita demonstrativa da barbearia e **total individual por barbeiro**, incluindo quantidade de atendimentos concluídos.

### Regra do faturamento

Para não confundir reservas com serviços prestados:

`Faturamento do profissional = soma do valor dos atendimentos marcados como Concluído para aquele profissional.`

`Faturamento da barbearia = serviços concluídos + pedidos de produtos marcados como Entregue.`

Os valores são **simulados**: não há cobrança nem verificação de recebimento. Agendamentos ainda confirmados não entram no faturamento.

## Como a tecnologia funciona

- **Array de objetos:** as barbearias, os agendamentos e pedidos são listas de objetos JavaScript.
- **`filter()` e `sort()`:** filtram e ordenam as barbearias ou os horários.
- **`localStorage`:** guarda alterações, reservas, pedidos, avaliações, fotos e tema **somente no navegador atual**.
- **`sessionStorage`:** lembra qual usuário de demonstração entrou, durante a sessão da aba.
- **`canvas`:** redimensiona fotos locais antes de armazená-las.
- **`location.hash`:** muda a rota sem precisar de frameworks. Exemplos: `#inicio`, `#barbearia/estacao47`, `#login`, `#painel`.
- **Variáveis CSS:** as cores do tema escuro e da barbearia mudam por estilos e uma classe no elemento `body`.

## Apresentação sugerida (7 a 10 minutos)

1. Comece na vitrine, filtre por bairro, abra a **Estação 47 Barber** e mostre o cabeçalho personalizado.
2. Alterne entre **claro e escuro**.
3. Faça um agendamento de demonstração com o profissional **Lucas**.
4. Volte ao painel e entre com `estacao47` / `demo123`.
5. Mostre a agenda: o agendamento aparece, mas **ainda não entra** no faturamento.
6. Clique em **Concluir**. Abra **Faturamento** e mostre o valor contabilizado para Lucas e para a barbearia.
7. Na aba **Fotos e equipe**, envie uma capa, uma foto do espaço e uma foto do Lucas.
8. Na aba **Informações e cores**, altere o nome ou a cor principal, salve e abra a vitrine para conferir.
9. Volte ao painel para mostrar avaliações, pedidos e catálogo de produtos.
10. Encerre explicando o limite intencional: **sem banco de dados, login real, API Google Maps ou processamento de pagamento**.

## Limitações esperadas no TCC

- O login simula uma sessão, mas **pode ser burlado por quem conhece JavaScript**; não serve para dados reais.
- As imagens e informações **não são compartilhadas** entre dispositivos, contas de navegador ou usuários diferentes.
- O `localStorage` tem limite pequeno; muitas fotos podem esgotar o espaço. Existe aviso de erro, mas não armazenamento remoto.
- O texto de horário de funcionamento é editável, porém os horários ofertados no agendamento seguem a regra demonstrativa fixa: segunda a sexta, 9h–19h; sábado, 9h–17h; domingo fechado.
- O cliente não recebe WhatsApp ou e-mail. Reservas, compras, avaliações e faturamento são somente simulações.
- **Não existe API Google Maps.** A integração com mapas e avaliações reais pode ser apresentada como escopo do terceiro módulo.

**Objetivo:** comprovar o funcionamento e a experiência das interfaces de clientes e proprietários com código simples de explicar.