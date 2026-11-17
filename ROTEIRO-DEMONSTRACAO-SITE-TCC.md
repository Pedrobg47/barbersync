# ROTEIRO DE DEMONSTRAÇÃO DO SITE — BARBERSYNC (5 INTEGRANTES)

**Tempo previsto:** 10–13 minutos + perguntas.  
**Site:** https://barbersync-one.vercel.app/  
**Objetivo:** apresentar uma história contínua, do cliente encontrando a barbearia até o proprietário gerenciando o atendimento e cadastrando seu negócio.

> A divisão é por pessoas, não por páginas soltas. Cada um assume o computador quando sua parte começar. Toda a demonstração deve acontecer **no mesmo navegador/perfil** para que as reservas do protótipo apareçam no painel.

## Ordem geral para o grupo

**Pessoa 1** — Página inicial e descoberta de barbearias → **Pessoa 2** — Cadastro e login do cliente → **Pessoa 3** — Perfil e agendamento → **Pessoa 4** — Login do barbeiro, agenda e faturamento → **Pessoa 5** — Planos, políticas e cadastro de uma nova barbearia.

---

## PESSOA 1 — APRESENTAÇÃO, PÁGINA INICIAL E BUSCA (~1min30)

### O que fazer na tela
1. Abra https://barbersync-one.vercel.app/ e mostre o nome **BarberSync**.
2. Role a página inicial para mostrar as barbearias e seus cards.
3. Digite algo na busca, teste o filtro de bairro ou a ordenação.
4. Alterne o tema escuro/claro rapidamente, se houver tempo.
5. Não entre numa barbearia ainda; a pessoa 3 fará isso.

### Fala pronta
"Bom dia/boa tarde. Nós desenvolvemos o BarberSync, uma plataforma demonstrativa voltada para barbearias de Barueri. A ideia é facilitar a vida de quem procura um lugar para cortar o cabelo e, ao mesmo tempo, oferecer ferramentas para o proprietário administrar sua barbearia. Na página inicial, o cliente visualiza estabelecimentos, pode pesquisar, aplicar filtros e comparar as opções. O site foi desenvolvido com HTML, CSS e JavaScript, usando uma organização inspirada no MVC."

**Passagem para a pessoa 2:** "Agora vamos mostrar como o cliente pode criar uma conta ou entrar para acompanhar seus agendamentos."

### Se o professor pedir o código
- `index.html` → pesquisar **TCC-HTML01** para mostrar a estrutura e o carregamento MVC.
- `style.css` → **TCC-CSS02** para as cores.
- `js/view.js` → **TCC-V09** e **TCC-V10** para vitrine e filtros.

**Pergunta provável:** "Por que os cards aparecem dinamicamente?"  
**Resposta:** "O JavaScript cria os cards usando os dados das barbearias, permitindo filtrar e ordenar sem escrever cada card manualmente no HTML."

---

## PESSOA 2 — ÁREA DO CLIENTE, CADASTRO E LOGIN (~1min30)

### O que fazer na tela
1. No cabeçalho, clique **Entrar como cliente**.
2. Mostre a opção **Criar conta de cliente** e os campos de cadastro; **não precisa preencher**, para não perder tempo nem gerar contas extras.
3. Clique em **Fazer login** ou volte à tela **Entrar como cliente**.
4. Faça login com **usuário `cliente` e senha `demo123`**.
5. Mostre a página **Minha conta**, onde os agendamentos vinculados a essa conta serão exibidos.
6. Clique em **Agendar novo atendimento** ou volte para **Explorar**.

### Fala pronta
"O BarberSync também tem uma área específica para clientes. Quem ainda não tem conta pode preencher um formulário com nome, usuário e senha de demonstração. Para agilizar nossa apresentação, vamos usar uma conta fictícia já cadastrada. Após o login, o cliente acessa sua própria área, onde consegue acompanhar os horários reservados. Assim, separamos a experiência do cliente da área administrativa do proprietário."

**Passagem para a pessoa 3:** "Com o cliente autenticado, vamos agora escolher uma barbearia e registrar um agendamento."

### Se o professor pedir o código
- `js/view.js` → **TCC-V03** e **TCC-V05**, formulários e área do cliente.
- `js/controller.js` → **TCC-C11** (login de cliente) e **TCC-C12** (cadastro).

**Pergunta provável:** "O login funciona com segurança em produção?"  
**Resposta:** "Ainda não. É um login demonstrativo que usa dados e sessões locais; a versão real precisa de autenticação segura em um servidor."

---

## PESSOA 3 — PERFIL DA BARBEARIA, SERVIÇOS E AGENDAMENTO (~2min)

### O que fazer na tela
1. Na página inicial, escolha **Estação 47 Barber**.
2. Mostre capa, galeria de fotos, profissionais, serviços, preços e produtos.
3. Aponte as avaliações.
4. No formulário, selecione **Corte masculino**, um profissional, uma data futura com disponibilidade e um horário livre.
5. Preencha **nome e telefone fictícios**; pode usar "Cliente Banca" e "(11) 90000-0000".
6. Clique em **Confirmar agendamento** e mostre a mensagem de confirmação.
7. Abra **Meus agendamentos** ou **Minha conta** para mostrar a reserva que foi registrada.

### Fala pronta
"Ao selecionar uma barbearia, o cliente encontra mais informações sobre o estabelecimento, como profissionais, serviços, produtos, fotos e avaliações. O principal recurso é o agendamento. Aqui escolhemos o serviço, o barbeiro, a data e um horário disponível. Quando confirmamos, o sistema verifica se aquela vaga ainda está livre e registra a reserva. Como o cliente fez login, o atendimento também aparece em sua conta."

**Passagem para a pessoa 4:** "Agora que o cliente registrou o horário, vamos trocar para a visão do proprietário e mostrar o que acontece com essa reserva."

### Se o professor pedir o código
- `js/view.js` → **TCC-V11** e **TCC-V12** (perfil e atualização dos horários).
- `js/controller.js` → **TCC-C14** (evento que confirma a reserva).
- `js/model.js` → **TCC-M11** (`horariosLivres()`).

**Pergunta provável:** "Como o sistema evita reservar duas vezes o mesmo horário?"  
**Resposta:** "Antes de registrar a reserva, a função `horariosLivres()` verifica os agendamentos já armazenados naquele navegador para aquele profissional, dia e horário. Em um sistema real, essa validação também precisaria acontecer no servidor."

---

## PESSOA 4 — LOGIN DO BARBEIRO E PAINEL ADMINISTRATIVO (~2min30)

### O que fazer na tela
1. Volte para **Início** e clique **Área do barbeiro** (ou abra a opção no cabeçalho).
2. Entre com **usuário `estacao47` / senha `demo123`**.
3. Mostre **Visão geral** do painel, com os indicadores.
4. Clique na aba **Agenda**, encontre o agendamento que a pessoa 3 acabou de criar.
5. Clique **Concluir** nesse atendimento.
6. Abra a aba **Faturamento** para mostrar que ele foi contabilizado.
7. Passe rapidamente por **Avaliações**, **Fotos e equipe**, **Produtos** e **Informações e cores**, mostrando que o dono pode gerenciar sua vitrine. Não precisa salvar nenhuma alteração nessas abas.

### Fala pronta
"O proprietário tem um painel diferente daquele que o cliente utiliza. Primeiro ele vê um resumo do negócio. Na Agenda, consegue acompanhar os agendamentos. Esta reserva acabou de ser feita pelo nosso colega. Quando o atendimento é realizado, o barbeiro pode marcá-lo como concluído. Só então o valor entra no faturamento demonstrativo. O painel também oferece áreas para avaliações, fotos, equipe, produtos e personalização da barbearia."

**Passagem para a pessoa 5:** "Depois de mostrar como uma barbearia já cadastrada é administrada, vamos demonstrar como um novo proprietário pode entrar na plataforma."

### Se o professor pedir o código
- `js/view.js` → **TCC-V13**, **TCC-V15**, **TCC-V17** para as abas e a tabela.
- `js/controller.js` → **TCC-C04** para concluir atendimento.
- `js/model.js` → **TCC-M14** para calcular o faturamento.

**Pergunta provável:** "Por que o valor só aparece depois de concluir?"  
**Resposta:** "Um agendamento é apenas uma reserva. A função `resumoReceita()` soma serviços concluídos e produtos entregues, não compromissos pendentes."

---

## PESSOA 5 — PLANOS, POLÍTICAS E CADASTRO DE BARBEARIA (~2min30)

### O que fazer na tela
1. Acesse a opção **Planos** pelo cabeçalho ou a página inicial.
2. Apresente os planos fictícios **Essencial (R$ 39,90/mês)**, **Profissional (R$ 79,90/mês)** e **Premium (R$ 129,90/mês)**.
3. Abra rapidamente **Políticas**, mostre a página e volte para **Planos**.
4. Clique em **Selecionar plano** em um dos três.
5. Mostre o formulário **Cadastrar barbeiro**. Preencha com **dados fictícios**:
   - Nome: **Barbeiro Apresentação**
   - Usuário: **barbeirobanca01** (se já existir no navegador, troque o final para 02 ou 03)
   - Senha de demonstração: **demo123**
   - Nome da barbearia: **Barbearia TCC Exemplo**
   - Bairro: **Centro**
   - Plano: o selecionado.
6. Marque o aceite dos termos e clique em **Criar meu acesso e vitrine**.
7. Mostre o painel da nova barbearia. Se houver tempo, abra **Informações e cores** para mostrar que a vitrine pode ser editada.
8. Para encerrar, volte à página inicial e procure a nova barbearia, cadastrada **neste navegador**.

### Fala pronta
"Além de conectar clientes e barbearias, o BarberSync propõe um modelo de negócio baseado em assinaturas mensais para os proprietários. Nesta etapa, os valores dos planos são apenas ilustrativos, sem cobranças reais. Também preparamos uma página de políticas para explicar os termos do protótipo. Vou demonstrar o cadastro de uma nova barbearia: o proprietário informa seus dados, escolhe um plano e cria o acesso. O sistema registra uma nova vitrine e libera o painel de personalização. Dessa forma, a plataforma contempla tanto a experiência do cliente quanto a entrada de novos estabelecimentos."

### Encerramento da apresentação
"Com isso, demonstramos o fluxo completo do BarberSync: descoberta de barbearias, conta do cliente, agendamento, gerenciamento pelo proprietário e cadastro de novos negócios. Organizamos o JavaScript em Model, View e Controller, adaptados ao front-end. Como é um protótipo acadêmico, ainda não temos backend, banco de dados, autenticação real, cobranças ou Google Maps. Essas são possibilidades de evolução."

### Se o professor pedir o código
- `js/view.js` → **TCC-V06**, **TCC-V07** (planos e políticas) e **TCC-V04** (formulário do barbeiro).
- `js/model.js` → **TCC-M08** (dados dos planos).
- `js/controller.js` → **TCC-C13** (cadastro do proprietário).

**Pergunta provável:** "O site já cobra os planos?"  
**Resposta:** "Não. Os planos demonstram nossa proposta de monetização; a cobrança recorrente seria integrada em uma etapa posterior."

---

## Sequência de telas — a cola rápida para o dia

```text
1. INÍCIO: vitrine, filtros, visual
                 ↓
2. ÁREA DO CLIENTE: mostrar cadastro → login com cliente/demo123
                 ↓
3. ESTAÇÃO 47: perfil → escolher serviço/horário → confirmar reserva
                 ↓
   MINHA CONTA: mostrar a reserva
                 ↓
4. ÁREA DO BARBEIRO: login estacao47/demo123
                 ↓
   AGENDA: concluir a reserva
                 ↓
   FATURAMENTO: mostrar a receita → outras abas
                 ↓
5. PLANOS: Essencial / Profissional / Premium
                 ↓
   POLÍTICAS: mostrar a página
                 ↓
   CADASTRO DE BARBEIRO: cadastrar nova barbearia fictícia
                 ↓
   PAINEL DA NOVA BARBEARIA → FIM
```

## Atenção: para evitar problemas durante a banca

- **Não usem dados pessoais verdadeiros.** Contas e senhas são demonstrativas e os dados ficam no navegador.
- **Não usem janela anônima para metade da demonstração**: os dados não seriam compartilhados com a janela normal.
- **Ensaiem o fluxo completo no mesmo navegador.** Se houver várias reservas antigas, escolham outra data/horário livre.
- **Cuidado com o cadastro da Pessoa 5:** um nome de usuário já cadastrado será recusado; mudem o sufixo (`01`, `02` etc.).
- **Evitem cadastrar a nova barbearia antes de demonstrar o painel da Estação 47**, porque o sistema muda para a conta do novo proprietário.
- **Só prometam o que existe:** pagamentos, assinaturas cobradas, mapas e sincronização entre aparelhos não estão implementados.
- **Se a internet falhar:** o código pode ser exibido no VS Code; o `index.html` pode ser aberto localmente com a pasta `js/` junto. Imagens externas podem não aparecer sem internet.

**Materiais complementares:** [GUIA-VSCODE-TCC.md](GUIA-VSCODE-TCC.md) | [ROTEIRO-APRESENTACAO-TCC.md](ROTEIRO-APRESENTACAO-TCC.md)
