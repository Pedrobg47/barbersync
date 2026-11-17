# BarberSync — Roteiro curto para apresentação do TCC

**Duração sugerida:** 6 a 8 minutos, sem contar as perguntas da banca.  
**Divisão sugerida:** 4 integrantes, identificados como Apresentador 1–4 (substituir pelos nomes).  
**Se forem 3 integrantes:** juntar as partes 1 e 3; cada pessoa continua demonstrando um código diferente.

> **Antes da apresentação:** abrir o BarberSync no navegador e o projeto no VS Code com `index.html`, `style.css`, `js/model.js`, `js/view.js` e `js/controller.js` disponíveis. Para encontrar comentários, usar Ctrl+F (Windows) ou Cmd+F (Mac) e pesquisar os marcadores `TCC-...`.

## 1) Apresentador 1 — Problema, objetivo e visual (1 a 1,5 min)

**Fala sugerida:**

"Nosso TCC é o BarberSync, uma plataforma demonstrativa que reúne barbearias de Barueri. O cliente consegue conhecer estabelecimentos, profissionais, serviços e produtos e simular um agendamento. Para o proprietário, existe um painel com agenda, faturamento e personalização. Fizemos esta etapa em HTML, CSS e JavaScript puro."

**Mostre no site:** a página inicial, a busca, os cards das barbearias e o tema azul-marinho/dourado.

**Mostre no código:**
- `index.html` → buscar `TCC-HTML01`: explica que o HTML carrega os arquivos Model, View e Controller, nessa ordem.
- `index.html` → buscar `TCC-HTML03`: `<main id="app"></main>` é onde o JavaScript monta as páginas.
- `style.css` → buscar `TCC-CSS02`: explica as cores e as variáveis CSS.

**Precisa saber:** HTML é a estrutura, CSS é a aparência e JavaScript controla os comportamentos. Não há React, backend, banco de dados nem Google Maps nesta etapa.

**Passagem:** "Agora o próximo integrante vai explicar onde ficam os dados e as regras do sistema."

## 2) Apresentador 2 — MODEL: dados e regras (1 a 1,5 min)

**Fala sugerida:**

"No padrão MVC, o Model concentra os dados e as regras de negócio. No BarberSync ele guarda informações de barbearias, profissionais, serviços e agendamentos. Usamos localStorage para que as alterações permaneçam neste navegador, mesmo após atualizar a página. Outra regra importante é verificar se o horário do profissional está disponível antes de registrar uma reserva."

**Mostre no código (arquivo `js/model.js`):**
- `TCC-M01`: dados fictícios usados na vitrine.
- `TCC-M04` e `TCC-M06`: `localStorage` e função `salvar()`.
- `TCC-M11`: `horariosLivres()` verifica conflitos de agenda.
- `TCC-M14`: `resumoReceita()` calcula o faturamento de atendimentos concluídos e produtos entregues.

**Precisa saber:** o `localStorage` não é um banco de dados de verdade; cada navegador tem seus próprios registros. A regra de disponibilidade não sincroniza horários entre computadores diferentes.

**Passagem:** "O Model fornece os dados e as regras; o próximo integrante vai mostrar como eles aparecem na interface."

## 3) Apresentador 3 — VIEW: telas, formulários e painel (1 a 1,5 min)

**Fala sugerida:**

"A View é responsável pelo que o usuário enxerga. No nosso sistema ela monta a vitrine, a página de cada barbearia, o formulário de agendamento, a agenda e o painel do proprietário. Por exemplo, a tela de agendamento apresenta os serviços e profissionais, e mostra os horários disponíveis calculados pelo Model."

**Mostre no site:** clique na **Estação 47 Barber**; exiba profissionais, serviços, produtos e campos do formulário.

**Mostre no código (arquivo `js/view.js`):**
- `TCC-V09`: `telaInicio()` monta a vitrine.
- `TCC-V11`: `telaBarbearia()` monta a página e o formulário.
- `TCC-V12`: `atualizarHorarios()` mostra os horários livres.
- `TCC-V13`: `telaPainel()` organiza o painel administrativo.

**Precisa saber:** a View **exibe** o formulário; ela não é quem salva a reserva. Essa ação é recebida pelo Controller.

**Passagem:** "Por fim, vamos demonstrar o Controller, que liga as ações da pessoa às regras e às telas."

## 4) Apresentador 4 — CONTROLLER: fluxo completo e demonstração (2 a 3 min)

**Fala sugerida:**

"O Controller recebe os eventos do usuário, como cliques e envio de formulários. Quando alguém confirma um agendamento, ele lê o serviço, o profissional, a data e a hora; consulta `horariosLivres()` no Model; registra a reserva por meio de `salvar()`; e atualiza a View, mostrando a confirmação."

**Mostre no código (arquivo `js/controller.js`):**
- `TCC-C09`: escuta o evento `submit` dos formulários.
- **`TCC-C14`: fluxo de agendamento MVC completo**, já explicado em comentários.
- `TCC-C04`: o barbeiro marca atendimento como **Concluído**, refletindo no faturamento.

**Demonstração ao vivo, na mesma aba/navegador:**

1. Abra o perfil da **Estação 47 Barber**.
2. Escolha **Corte masculino**, um profissional e um horário disponível; digite um nome e telefone **fictícios**; clique em **Confirmar agendamento**.
3. Vá para **Área do barbeiro**, entre com `estacao47` / `demo123`.
4. No painel, abra **Agenda** e encontre o agendamento.
5. Clique **Concluir** e abra **Faturamento** para mostrar que o valor foi somado.

**Precisa saber:** a reserva só entra no faturamento quando o serviço fica **Concluído**. Para pedidos de produtos, quando ficam **Entregues**. Não há recebimento real de dinheiro.

**Conclusão sugerida:**

"Assim demonstramos a separação em MVC adaptado ao front-end: a View mostra as telas, o Controller recebe a ação e o Model contém as regras e os dados. Essa estrutura facilita entender, organizar e evoluir o código nas próximas etapas."

---

## Respostas para as perguntas mais prováveis

**O que é MVC?**  
"Model, View e Controller: dados e regras, interface e ações. Aplicamos essa separação ao JavaScript do front-end."

**É MVC completo?**  
"É uma organização inspirada no MVC, adaptada ao protótipo front-end. Ainda não existe um backend MVC."

**Onde fica o banco de dados?**  
"Não usamos banco nesta etapa; o Model usa `localStorage` para simular persistência no navegador."

**O login é seguro?**  
"Não. É uma simulação com credenciais fictícias. Um sistema real precisaria de backend e autenticação segura."

**Como evitar dois agendamentos na mesma hora?**  
"A função `horariosLivres()`, no Model, filtra os horários ocupados daquele profissional. Isso funciona nos registros locais do navegador."

**O que ocorre ao clicar Confirmar?**  
"View mostra o formulário → Controller recebe o envio → Model verifica disponibilidade → Controller registra e chama `salvar()` → View exibe a confirmação."

**Como calcular o faturamento?**  
"`resumoReceita()` considera os atendimentos marcados como Concluídos e os pedidos marcados como Entregues."

**Por que não há Google Maps?**  
"É uma integração planejada para outro módulo. Nesta etapa trabalhamos com barbearias demonstrativas."

## Checklist do grupo antes de entrar na sala

- [ ] Baixar o código **atualizado** em [github.com/Pedrobg47/barbersync](https://github.com/Pedrobg47/barbersync).
- [ ] Abrir a pasta no VS Code e localizar os marcadores `TCC-M11`, `TCC-V11` e `TCC-C14`.
- [ ] Conferir a página [barbersync-one.vercel.app](https://barbersync-one.vercel.app/) no computador da apresentação.
- [ ] Simular um agendamento e sua conclusão **no mesmo navegador** antes da banca.
- [ ] Deixar uma aba do navegador com o site e uma janela do VS Code com os 3 arquivos MVC.
- [ ] Todos saberem responder: **MVC, localStorage, agendamento e limitações do protótipo**.

**Regra para o grupo:** cada integrante precisa conseguir explicar **uma função real de seu arquivo**, sem depender só de decorar a fala. O roteiro serve para guiar a explicação do que foi implementado.
