# BarberSync — TCC | Protótipo Front-end

Marketplace demonstrativo de barbearias de Barueri, com **vitrine**, **agendamentos**, **contas de cliente e barbeiro**, **painel administrativo**, **produtos com fotos**, **avaliações**, **planos mensais ilustrativos** e **página de políticas**.

## Tecnologias

Somente **HTML, CSS e JavaScript puro**. Sem React, Node, banco de dados, backend, Google Maps, integração com Google Meu Negócio, APIs comerciais, meios de pagamento ou cobrança. As fotos ilustrativas usam endereços públicos de imagens; fotos enviadas pelo proprietário ficam no próprio navegador.

| Arquivo | Explicação |
|---|---|
| `index.html` | Estrutura do cabeçalho, navegação, conteúdo e rodapé. |
| `style.css` | Visual azul-marinho, preto e dourado, temas escuro/claro e responsividade. |
| `js/model.js` | **Model:** dados, armazenamento local e regras de negócio (horários, faturamento). |
| `js/view.js` | **View:** exibe as telas, vitrine, formulários, agenda e painel. |
| `js/controller.js` | **Controller:** recebe cliques e formulários, chama as regras e atualiza a interface. |
| `README.md` | Este guia para o TCC. |

## Como abrir

Abra `index.html` no navegador. Mantenha a pasta `js/` junto do HTML; ela contém os arquivos do MVC. Para publicar, importe o repositório na Vercel como projeto estático (**Other**, sem build) e faça o deploy. Caso já tenha um deploy da Vercel integrado ao GitHub, consulte a implantação da branch `main`.

## Arquitetura MVC (pergunta frequente do professor)

**MVC** é a sigla de **Model–View–Controller (Modelo–Visão–Controlador)**, um padrão para separar responsabilidades.

Neste projeto aplicamos uma **organização inspirada no MVC apenas no front-end**, sem afirmar que existe um sistema MVC completo com servidor:

| Parte | Arquivo | Responsabilidade | Exemplo do BarberSync |
| --- | --- | --- | --- |
| Model (Modelo) | `js/model.js` | Dados e regras de negócio | `horariosLivres()`, `resumoReceita()`, listas de agendamentos e `localStorage` |
| View (Visão) | `js/view.js` | Montar e atualizar a interface HTML | `telaBarbearia()`, `telaPainel()`, `tabelaAgenda()` |
| Controller (Controlador) | `js/controller.js` | Receber eventos e coordenar Model + View | `submit` do formulário `form-agendar` e a função `renderizar()` |

### Exemplo na prática — cliente agenda corte

1. **View**: `telaBarbearia()` desenha o formulário de agendamento.
2. **Controller**: o listener de `submit` lê serviço, profissional, dia e horário.
3. **Model**: `horariosLivres()` verifica se o horário está livre, e o Controller adiciona o agendamento ao array e chama `salvar()` do Model.
4. **View**: `telaBarbearia()` mostra os horários atualizados e o Controller exibe a confirmação.

**Resposta pronta ao professor:** "Sim. Para o escopo atual, aplicamos MVC adaptado ao front-end. Separamos os dados e as regras no Model, a apresentação das telas na View e os eventos dos usuários no Controller. Ainda não temos o MVC de uma aplicação completa com backend e banco de dados."

### Por que não usamos frameworks?

Porque o objetivo do módulo é demonstrar as interfaces e conseguir explicar o código. Usamos **arquivos JavaScript comuns**, carregados no `index.html` nesta ordem:

```html
<script src="js/model.js" defer></script>
<script src="js/view.js" defer></script>
<script src="js/controller.js" defer></script>
```

A ordem importa porque o Controller usa funções declaradas nos arquivos anteriores. Não usamos `import` ou bibliotecas.

**Limitação:** os dados ficam somente no navegador; por isso o login de demonstração **não é autenticação segura**. O padrão MVC ajuda a organizar o código, mas não substitui segurança, servidor ou banco de dados.

---

## Contas de demonstração

**Barbeiro (já criado):** usuário `estacao47`, senha `demo123`. Outras contas: `nobre`, `distrito`, `vertice`, todas com `demo123`.

**Cliente (já criado):** usuário `cliente`, senha `demo123`.

É possível **criar novos usuários**:
- **Barbeiro:** Área do barbeiro → Criar conta de barbeiro. Defina usuário, senha fictícia, nome da barbearia, bairro e plano. Uma vitrine nova é criada localmente e associada ao login de demonstração.
- **Cliente:** Entrar como cliente → Criar conta de cliente. Defina um nome, usuário e senha fictícios. Após entrar, o cliente vê apenas os agendamentos vinculados ao seu usuário local.

**Importante sobre segurança:** o cadastro é apenas visual. Os usuários e senhas são armazenados **em texto simples no navegador**, sem autenticação real; qualquer pessoa com acesso ao navegador pode inspecionar os dados. **Nunca utilize senhas ou dados pessoais verdadeiros.** Em uma aplicação comercial, seria obrigatório autenticar no servidor e proteger os dados.

## Funcionalidades por área

### Vitrine / Cliente
1. Busque barbearias por nome ou bairro. Filtre e ordene.
2. Abra um estabelecimento: o nome da barbearia aparece no topo direito, com o logo B para retornar à vitrine.
3. Veja fotos, serviços, profissionais, avaliações e produtos (com fotos quando cadastradas).
4. Escolha serviço, profissional e data. O formulário sugere a **próxima data com horário livre**. Escolha uma hora e confirme com nome e telefone *fictícios*.
5. A reserva aparece na **Agenda** da barbearia. Ao entrar como cliente, a reserva fica associada à conta e aparece em **Minha conta**.
6. Um cliente pode cancelar reservas ainda **Confirmadas**. Reservas canceladas liberam o horário neste navegador.
7. Avalie a barbearia e simule um pedido de produto.

### Painel do barbeiro
- **Visão geral:** próximos agendamentos, valores de serviços concluídos, produtos entregues, faturamento demonstrativo, resultados por profissional e resumo das avaliações.
- **Agenda:** reservas de exemplo e reservas criadas. Clique em **Concluir** para contabilizar o serviço.
- **Faturamento:** valores por profissional e total da barbearia (serviços concluídos + produtos entregues), com explicação clara dos critérios.
- **Avaliações:** média, quantidade, distribuição por estrelas e lista de comentários do próprio navegador.
- **Pedidos:** marque produtos simulados como **Entregue**.
- **Informações e cores:** edite descrição, horário exibido, nome, bairro, profissionais e cor de destaque.
- **Fotos e equipe:** envie foto de capa, galeria e imagens dos profissionais. O JavaScript comprime as fotos antes de salvá-las em `localStorage`.
- **Produtos:** crie produtos, edite a imagem de **cada** produto existente (ex.: pomada modeladora e óleo para barba) e exclua itens.

### Dados de exemplo para o TCC

Para evitar abas vazias, uma instalação nova inicia com **agendamentos fictícios**, alguns **Concluídos** e outros **Confirmados**, além de um pedido simulado entregue onde houver produto. Os exemplos aparecem identificados como **EXEMPLO** na agenda.

Em uma barbearia sem agendamentos, use o botão **Inserir agendamentos de demonstração**. O botão **Restaurar dados da demonstração** repõe os exemplos da barbearia atual. Essa ação não deve excluir contas criadas.

### Planos e políticas

A página **Planos** mostra uma proposta de assinatura mensal do BarberSync:
- Essencial: R$ 39,90/mês
- Profissional: R$ 79,90/mês
- Premium: R$ 129,90/mês

São **preços fictícios do TCC**. Os planos não cobram, não renovam assinaturas, não exigem cartão e **ainda não aplicam restrições de funcionalidades**. Os botões encaminham para cadastro e registram a escolha demonstrativa do proprietário.

A página **Políticas e termos** contém um modelo acadêmico com termos de uso, privacidade, imagens e avaliações, cancelamentos, pedidos, assinaturas e integrações futuras. **Não é documento jurídico revisado para operação real.**

## Como os códigos funcionam (explicação para professores)

- `barbearias`, `agendamentos` e `pedidos` são **arrays de objetos**, não tabelas em banco.
- `filter()` e `sort()` ajudam a procurar barbearias e encontrar reservas.
- `horariosLivres()` encontra horários dentro da grade fixa e ignora reservas confirmadas/concluídas do mesmo profissional. `proximaDataDisponivel()` escolhe uma data com vagas.
- `resumoReceita()` calcula o total de serviços **Concluídos** por barbeiro e soma os pedidos **Entregues** para o resultado geral.
- `painelAvaliacoes()` calcula distribuição por estrelas com base nos comentários locais. A nota ilustrativa histórica da vitrine é mostrada separadamente.
- `localStorage` salva contas fictícias, agendamentos, barbearias, fotos, pedidos e tema. `sessionStorage` simula qual usuário está logado durante a sessão.
- `comprimirFoto()` utiliza `canvas` no navegador, sem enviar imagens para qualquer servidor.
- O Controller usa `location.hash` para mudar de tela (`#inicio`, `#planos`, `#politicas`, `#login`, `#login-cliente`, `#cadastro-cliente`, `#cadastro-barbeiro`, `#painel`, `#conta-cliente`).

## Roteiro rápido de apresentação

1. Abra a vitrine, mostre o tema **azul-marinho/preto/dourado**, alterne entre escuro e claro e filtre uma barbearia.
2. Entre como cliente usando `cliente` / `demo123`. Abra uma barbearia e faça um agendamento.
3. Confira o agendamento em **Minha conta**.
4. Entre como barbeiro usando `estacao47` / `demo123`. Na **Agenda**, localize a nova reserva e marque **Concluir**.
5. Abra **Faturamento** para mostrar que o profissional e a barbearia receberam os valores *simulados*.
6. Abra **Avaliações** e mostre média e distribuição de estrelas.
7. Vá em **Produtos** e envie uma foto para a pomada ou o óleo de barba. Confira a imagem no perfil público.
8. Mostre **Criar conta de barbeiro**, escolha um plano de assinatura fictícia.
9. Termine pela página **Políticas** e explique que o backend, autenticação real, pagamentos e Google Maps ficam para módulos futuros.

## Limitações (devem ser mencionadas no TCC)

1. Sem login seguro ou validação em servidor.
2. Sem sincronização entre aparelhos ou navegadores; não existe disponibilidade compartilhada.
3. Limite de espaço no navegador para guardar as imagens (JPG/PNG/WebP, até 6 MB antes da compressão).
4. Grade de agendamento é fixa (seg–sex: 9h–19h; sáb: 9h–17h; dom: fechado). O texto de funcionamento editável ainda não altera essa grade.
5. O faturamento e as avaliações são **demonstrativos**; não representam recebimentos ou avaliações verificadas do Google.
6. Sem Google Maps, checkout real, cobrança de mensalidades, notificações, ou conexão com WhatsApp.

**Objetivo do módulo:** apresentar interfaces utilizáveis e explicar o fluxo de produto com tecnologia básica, sem o custo/complexidade de uma arquitetura de produção.
