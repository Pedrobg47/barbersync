# BarberSync — Roteiro para 5 integrantes + perguntas da banca

**Tempo sugerido:** 9 a 11 minutos + perguntas, com cerca de 1–2 minutos por pessoa.  
**Integrantes:** substituam "Pessoa 1" até "Pessoa 5" pelos nomes reais.  
**Objetivo:** cada integrante apresenta uma área do site, uma parte do código e responde **duas perguntas** sobre essa área.  
**Versão do projeto:** HTML, CSS e JavaScript puro; MVC **adaptado ao front-end**. Os cadastros, agendamentos, valores e pagamentos são demonstrativos.

## Preparação (todos fazem antes da banca)

1. Abram [barbersync-one.vercel.app](https://barbersync-one.vercel.app/) no navegador.
2. No VS Code, abram a pasta **barbersync-main** baixada de [github.com/Pedrobg47/barbersync](https://github.com/Pedrobg47/barbersync).
3. Deixem abertas as abas `index.html`, `style.css`, `js/model.js`, `js/view.js` e `js/controller.js`.
4. Para encontrar os comentários no VS Code, usem **Ctrl + F** (Windows) ou **Cmd + F** (Mac) e pesquisem o marcador `TCC-...`.
5. Para a demonstração de reservas e do painel, usem **o mesmo navegador e perfil**; os dados são locais.

---

## Pessoa 1 — Apresentação, vitrine e identidade visual (~1min30)

**Responsabilidade:** explicar o problema, a proposta do BarberSync e a aparência da plataforma.

**Fala curta para praticar:**

> "O BarberSync é um protótipo de plataforma para descobrir barbearias de Barueri. A pessoa pode pesquisar estabelecimentos, conhecer serviços e profissionais e simular um agendamento. Construímos a interface em HTML, CSS e JavaScript, com identidade azul-marinho, preto e dourado. Nosso objetivo foi conectar a experiência do cliente à administração da barbearia."

**Na tela:** página inicial → busca e filtros → cards → alternar tema claro/escuro.

**No VS Code:**
- `index.html` → **TCC-HTML01**: carrega os três arquivos MVC na ordem Model, View e Controller.
- `index.html` → **TCC-HTML03**: `<main id="app"></main>` recebe as telas criadas pelo JavaScript.
- `style.css` → **TCC-CSS02**: paleta e variáveis CSS; **TCC-CSS03**: modo escuro.
- `js/view.js` → **TCC-V09**: página inicial; **TCC-V10**: filtro e ordenação.

**Duas perguntas para treinar:**
1. **Professor: "Por que a página inicial não tem todos os cards escritos diretamente no HTML?"**  
   **Resposta:** "Porque a função `telaInicio()` da View monta a página dinamicamente no elemento `#app`; os cards são gerados a partir dos dados do Model. Assim conseguimos filtrar e ordenar usando JavaScript."
2. **Professor: "Qual é a diferença entre HTML, CSS e JavaScript aqui?"**  
   **Resposta:** "O HTML define a estrutura principal, o CSS organiza a aparência e a responsividade, e o JavaScript monta as telas dinâmicas e controla as funcionalidades."

**Passagem:** "Agora vamos mostrar como as informações e regras por trás dessas telas estão organizadas."

---

## Pessoa 2 — MODEL: dados, persistência e disponibilidade (~1min30)

**Responsabilidade:** mostrar a camada de dados e a regra que impede conflito de horários dentro do navegador.

**Fala curta para praticar:**

> "No Model concentramos os dados de barbearias, serviços, produtos, clientes e agendamentos. A função `salvar()` guarda os registros no `localStorage` do navegador. Também temos `horariosLivres()`, que verifica a data, o profissional e as reservas já feitas antes de permitir um novo agendamento."

**Na tela:** mostre no formulário que os horários mudam quando o profissional ou a data são alterados.

**No VS Code — `js/model.js`:**
- **TCC-M01** e **TCC-M03**: dados e barbearias fictícias.
- **TCC-M04** e **TCC-M06**: `localStorage`, `carregar()` e `salvar()`.
- **TCC-M11**: `horariosLivres()`.
- **TCC-M14**: `resumoReceita()` (a pessoa 5 retomará essa função).

**Duas perguntas para treinar:**
1. **Professor: "Onde fica o banco de dados e os agendamentos são compartilhados entre computadores?"**  
   **Resposta:** "Ainda não temos banco de dados. O `localStorage` guarda os registros apenas naquele navegador; por isso não há sincronização entre computadores. Um backend com banco seria necessário na versão real."
2. **Professor: "Como o sistema evita dois clientes no mesmo horário?"**  
   **Resposta:** "A função `horariosLivres()` consulta as reservas existentes para a mesma barbearia, data, hora e profissional. Horários já ocupados não aparecem como livres naquele navegador. É uma validação local, não uma reserva concorrente entre aparelhos."

**Passagem:** "O Model entrega os dados e as regras; a próxima pessoa vai mostrar como isso vira interface para o cliente."

---

## Pessoa 3 — VIEW: perfil, serviços, produtos e avaliações (~1min30)

**Responsabilidade:** explicar como o site apresenta barbearias, profissionais e formulários sem guardar as ações diretamente na tela.

**Fala curta para praticar:**

> "A View é responsável pelo conteúdo visual. A função `telaBarbearia()` mostra a capa, fotos, profissionais, serviços, produtos e o formulário de agendamento. Já a `atualizarHorarios()` consulta os horários calculados pelo Model e atualiza as opções mostradas ao cliente."

**Na tela:** abrir **Estação 47 Barber** → mostrar fotos/profissionais/serviços/produtos → formulário → avaliações.

**No VS Code — `js/view.js`:**
- **TCC-V11**: `telaBarbearia()`, perfil e formulário de agendamento.
- **TCC-V12**: `atualizarHorarios()`.
- **TCC-V16**: `painelAvaliacoes()`, média e distribuição de estrelas.
- **TCC-V19**: janelas de avaliações e pedidos demonstrativos.

**Duas perguntas para treinar:**
1. **Professor: "A View também salva a reserva?"**  
   **Resposta:** "Não. A View monta o formulário e exibe os dados. Quem recebe o envio, valida o fluxo e chama o Model é o Controller. Isso é justamente parte da separação MVC."
2. **Professor: "Como são mostradas as avaliações?"**  
   **Resposta:** "A função `painelAvaliacoes()` lê a lista de avaliações da barbearia, calcula a média e conta quantas notas existem de 1 a 5 estrelas para montar o resumo visual."

**Passagem:** "Agora vamos seguir o que acontece quando o cliente realmente confirma o horário."

---

## Pessoa 4 — CONTROLLER: agendamento e cadastro (~2 min)

**Responsabilidade:** demonstrar **o fluxo MVC completo**, a parte técnica mais importante.

**Fala curta para praticar:**

> "O Controller escuta eventos, como cliques e envio de formulários. Quando o cliente confirma um horário, ele lê os campos da View, chama `horariosLivres()` do Model para verificar se a vaga continua disponível, adiciona o agendamento aos dados e chama `salvar()`. Depois atualiza a interface e mostra a confirmação."

**Na tela, demonstração real:** na Estação 47, escolher **Corte masculino**, profissional, dia e horário livre; preencher **dados fictícios**; clicar em **Confirmar agendamento**.

**No VS Code — `js/controller.js`:**
- **TCC-C09**: `addEventListener('submit')` recebe formulários e impede recarregamento.
- **TCC-C14**: bloco `if (form.id==='form-agendar')`; ele explica as **6 etapas do MVC em comentários**.
- **TCC-C12**: cadastro de cliente; **TCC-C13**: cadastro de proprietário.

**Duas perguntas para treinar:**
1. **Professor: "Explique o caminho de um agendamento pelo MVC."**  
   **Resposta:** "A View monta o formulário; o Controller recebe o envio e coleta os valores; o Model verifica disponibilidade; o Controller registra e chama `salvar()` do Model; a View é atualizada com a confirmação."
2. **Professor: "E se alguém tentar reservar um horário que acabou de ser ocupado?"**  
   **Resposta:** "O Controller chama `horariosLivres()` outra vez na confirmação. Se a hora não estiver disponível nos dados locais, ele bloqueia o envio e atualiza os horários. A sincronização entre usuários diferentes exigiria um servidor."

**Passagem:** "A reserva foi registrada. Agora veremos como o proprietário acompanha o atendimento e o resultado financeiro."

---

## Pessoa 5 — Painel do barbeiro, faturamento e planos (~2min)

**Responsabilidade:** apresentar a administração e como o projeto poderia se sustentar comercialmente.

**Fala curta para praticar:**

> "O proprietário tem um painel com agenda, faturamento, avaliações, fotos e catálogo. Quando conclui um atendimento, o status passa para 'Concluído'; a função `resumoReceita()` contabiliza esse serviço no faturamento demonstrativo. Também propusemos três planos mensais para futuras assinaturas das barbearias, mas o protótipo ainda não efetua cobranças."

**Na tela:** Área do barbeiro → login `estacao47` / `demo123` → **Agenda** → localizar a reserva feita pela pessoa 4 → **Concluir** → **Faturamento** → **Avaliações**. Se houver tempo, abrir **Planos** e **Políticas**.

**No VS Code:**
- `js/controller.js` → **TCC-C04**: botão Concluir altera o status.
- `js/model.js` → **TCC-M14**: `resumoReceita()` soma valores de serviços concluídos e produtos entregues.
- `js/view.js` → **TCC-V13**, **TCC-V15**, **TCC-V17**: painel, abas e tabela do faturamento.
- `js/model.js` → **TCC-M08**: planos com preços ilustrativos.
- `js/view.js` → **TCC-V06** e **TCC-V07**: páginas Planos e Políticas.

**Duas perguntas para treinar:**
1. **Professor: "Por que um agendamento confirmado ainda não entra no faturamento?"**  
   **Resposta:** "Porque agendar não é realizar o serviço. O Model só soma o atendimento quando seu status é `Concluído`. Em produtos, só entram os pedidos marcados como `Entregue`."
2. **Professor: "Os planos mensais já cobram as barbearias?"**  
   **Resposta:** "Não. Os planos Essencial, Profissional e Premium são uma proposta de monetização para o TCC. Os preços e a seleção são ilustrativos; não há checkout, assinatura recorrente nem cobrança real."

**Fechamento:**

> "O BarberSync demonstra um fluxo completo dentro do navegador: descoberta de barbearias, agendamento, acompanhamento e administração. A arquitetura é inspirada no MVC e está separada em Model, View e Controller. Como próximo passo, seriam necessários backend, banco de dados, autenticação segura e integrações reais."

---

## Cola rápida: 10 perguntas distribuídas

| Pessoa | Pergunta 1 | Pergunta 2 |
|---|---|---|
| **1 — Interface** | Por que os cards são montados pelo JS? | Diferença entre HTML, CSS e JS? |
| **2 — Model** | Onde ficam os dados? | Como evita choque de horários? |
| **3 — View** | A View salva reservas? | Como aparecem as avaliações? |
| **4 — Controller** | Qual o fluxo MVC do agendamento? | O que ocorre se a vaga estiver ocupada? |
| **5 — Administração** | Por que agendar não soma receita? | As mensalidades já são reais? |

## Perguntas surpresa — TODOS devem responder

**"O MVC é completo?"** — "Não. Organizamos o front-end em arquivos inspirados no MVC; ainda não há backend."

**"O login é seguro?"** — "Não, é demonstrativo e usa dados locais. Um produto real teria autenticação segura no servidor."

**"Onde fica o Google Maps?"** — "A integração foi planejada para uma etapa futura; este módulo trabalha com exemplos de barbearias."

**"O que acontece se eu abrir o projeto em outro computador?"** — "O site abre, mas as reservas feitas no primeiro navegador não aparecerão, porque não há sincronização."

**"Como vocês encontram o código?"** — "Os trechos estão comentados com marcadores como `TCC-M11`, `TCC-V11` e `TCC-C14`; é só usar Ctrl+F ou Cmd+F no VS Code."

## Checklist para a apresentação

- [ ] Dividir e escrever o nome real de cada integrante nas partes 1 a 5.
- [ ] Todos saberem abrir a pasta `js/` no VS Code e localizar seu marcador.
- [ ] Ensaiar as **duas perguntas** de cada pessoa, sem depender só de leitura.
- [ ] Abrir o site [barbersync-one.vercel.app](https://barbersync-one.vercel.app/) e testar antes da banca.
- [ ] Demonstrar reserva e faturamento **na mesma sessão do navegador**.
- [ ] Usar nomes e telefones fictícios; `estacao47` / `demo123` é o login demonstrativo.
- [ ] Evitar prometer funcionalidades inexistentes: banco real, Google Maps, pagamento e login seguro ainda não existem.

**Plano B:** se a internet falhar, abra `index.html` localmente (com a pasta `js/` junto). As imagens externas podem não carregar offline, mas o código e os dados fictícios permanecem no projeto.
