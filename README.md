# BarberSync — TCC | Protótipo Front-end

Marketplace demonstrativo de barbearias de Barueri, com **vitrine**, **agendamentos**, **contas de cliente e barbeiro**, **painel administrativo**, **produtos com fotos**, **avaliações**, **planos mensais ilustrativos** e **página de políticas**.

## Tecnologias

Somente **HTML, CSS e JavaScript puro**. Sem React, Node, banco de dados, backend, Google Maps, integração com Google Meu Negócio, APIs comerciais, meios de pagamento ou cobrança. As fotos ilustrativas usam endereços públicos de imagens; fotos enviadas pelo proprietário ficam no próprio navegador.

| Arquivo | Explicação |
|---|---|
| \`index.html\` | Estrutura do cabeçalho, navegação, conteúdo e rodapé. |
| \`style.css\` | Visual azul-marinho, preto e dourado, temas escuro/claro e responsividade. |
| \`script.js\` | Regras simples para telas, cadastros demonstrativos, agendamentos e cálculo de faturamento. |
| \`README.md\` | Este guia para o TCC. |

## Como abrir

Abra \`index.html\` no navegador. Para publicar, importe o repositório na Vercel como projeto estático (**Other**, sem build) e faça o deploy. Caso já tenha um deploy da Vercel integrado ao GitHub, consulte a implantação da branch \`main\`.

## Contas de demonstração

**Barbeiro (já criado):** usuário \`estacao47\`, senha \`demo123\`. Outras contas: \`nobre\`, \`distrito\`, \`vertice\`, todas com \`demo123\`.

**Cliente (já criado):** usuário \`cliente\`, senha \`demo123\`.

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
- **Fotos e equipe:** envie foto de capa, galeria e imagens dos profissionais. O JavaScript comprime as fotos antes de salvá-las em \`localStorage\`.
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

- \`barbearias\`, \`agendamentos\` e \`pedidos\` são **arrays de objetos**, não tabelas em banco.
- \`filter()\` e \`sort()\` ajudam a procurar barbearias e encontrar reservas.
- \`horariosLivres()\` encontra horários dentro da grade fixa e ignora reservas confirmadas/concluídas do mesmo profissional. \`proximaDataDisponivel()\` escolhe uma data com vagas.
- \`resumoReceita()\` calcula o total de serviços **Concluídos** por barbeiro e soma os pedidos **Entregues** para o resultado geral.
- \`painelAvaliacoes()\` calcula distribuição por estrelas com base nos comentários locais. A nota ilustrativa histórica da vitrine é mostrada separadamente.
- \`localStorage\` salva contas fictícias, agendamentos, barbearias, fotos, pedidos e tema. \`sessionStorage\` simula qual usuário está logado durante a sessão.
- \`comprimirFoto()\` utiliza \`canvas\` no navegador, sem enviar imagens para qualquer servidor.
- O site usa \`location.hash\` para mudar de tela (\`#inicio\`, \`#planos\`, \`#politicas\`, \`#login\`, \`#login-cliente\`, \`#cadastro-cliente\`, \`#cadastro-barbeiro\`, \`#painel\`, \`#conta-cliente\`).

## Roteiro rápido de apresentação

1. Abra a vitrine, mostre o tema **azul-marinho/preto/dourado**, alterne entre escuro e claro e filtre uma barbearia.
2. Entre como cliente usando \`cliente\` / \`demo123\`. Abra uma barbearia e faça um agendamento.
3. Confira o agendamento em **Minha conta**.
4. Entre como barbeiro usando \`estacao47\` / \`demo123\`. Na **Agenda**, localize a nova reserva e marque **Concluir**.
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
