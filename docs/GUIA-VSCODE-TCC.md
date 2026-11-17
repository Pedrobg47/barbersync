# GUIA VISUAL — Como mostrar o código do BarberSync no VS Code (TCC)

> **Comece por aqui se o professor pedir para ver o MVC ou explicar como uma funcionalidade foi programada.**
> O projeto é front-end em HTML, CSS e JavaScript puro. É uma **organização inspirada no MVC**, adaptada ao protótipo, sem servidor, banco de dados ou login seguro.

## 1. Abrir o projeto no VS Code (Windows ou Mac)

**Jeito mais fácil, sem Git:**

1. Abra [github.com/Pedrobg47/barbersync](https://github.com/Pedrobg47/barbersync).
2. Clique no botão verde **Code** e depois em **Download ZIP**.
3. Extraia o ZIP: no Windows, botão direito > **Extrair tudo**. No Mac, clique duas vezes no ZIP.
4. No **Visual Studio Code**, escolha **Arquivo > Abrir Pasta...** (*File > Open Folder*).
5. Selecione a pasta extraída **barbersync-main** e clique em **Abrir**. Caso apareça uma confirmação de confiança, verifique a pasta antes de aceitar.
6. Abra o **Explorador** no canto esquerdo para ver os arquivos. Atalho: **Ctrl+Shift+E** (Windows) ou **Cmd+Shift+E** (Mac).

**Se você já tem Git instalado:** use **Terminal > Novo Terminal** no VS Code e execute:

```bash
git clone https://github.com/Pedrobg47/barbersync.git
cd barbersync
code .
```

O comando `code .` depende de o comando do VS Code estar configurado no terminal. Também dá para abrir a pasta pelo menu **Arquivo > Abrir Pasta**. Se já clonou esse repositório anteriormente, execute `git pull` na pasta em vez de baixar uma versão antiga.

## 2. Entenda a árvore de arquivos que aparece à esquerda

```text
BARBERSYNC
│
├── index.html                ← Estrutura da página; carrega o MVC
├── style.css                 ← Cores, botões, modo escuro e claro
│
├── js/                       ← ABRA ESTA PASTA PARA MOSTRAR O MVC
│   ├── model.js              ← [MODEL] Dados e regras
│   ├── view.js               ← [VIEW] Telas e formulários
│   └── controller.js         ← [CONTROLLER] Cliques e ações
│
├── README.md                 ← Explicação geral do TCC
└── GUIA-VSCODE-TCC.md        ← Este guia para a banca
```

**MVC = Model (Modelo) + View (Visão) + Controller (Controlador).**

- **Model:** decide quais dados existem e como calcular. Ex.: horários disponíveis e faturamento.
- **View:** mostra os dados na tela. Ex.: formulário de corte e tabela da agenda.
- **Controller:** recebe as ações. Ex.: clique em **Confirmar agendamento** e comando para salvar.

## 3. COMO ACHAR OS COMENTÁRIOS DESTACADOS NO CÓDIGO

Os arquivos JavaScript foram anotados com blocos grandes como este:

```js
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-M14] FATURAMENTO POR BARBEIRO E TOTAL DA BARBEARIA        ║
// ╚══════════════════════════════════════════════════════════════╝
```

**Como encontrar sem ficar rolando o código:**

1. Pressione **Ctrl+P** (Windows) ou **Cmd+P** (Mac).
2. Digite `js/model.js` e dê **Enter** para abrir o arquivo.
3. Pressione **Ctrl+F** / **Cmd+F**.
4. Pesquise `TCC-M14`. O VS Code saltará diretamente ao bloco de faturamento.
5. Para procurar TODOS os marcadores no projeto, use **Ctrl+Shift+F** / **Cmd+Shift+F** e procure `TCC-`.
6. Para localizar uma função dentro do arquivo atual, pressione **Ctrl+Shift+O** / **Cmd+Shift+O** e digite o nome dela.

Os comentários explicam as funções **sem alterar o funcionamento** do site. Em geral aparecem com a cor própria de comentários definida pelo tema do VS Code.

## 4. Quais arquivos e marcadores mostrar ao professor

| Pergunta do professor | Abra no VS Code | Pesquise no arquivo | O que explicar |
|---|---|---|---|
| **Onde está o MVC?** | `index.html` | `TCC-HTML01` | Model, View e Controller carregados na ordem certa |
| **Onde estão os dados?** | `js/model.js` | `TCC-M01` | Listas de objetos de barbearias, serviços e produtos |
| **Onde fica salvo?** | `js/model.js` | `TCC-M04` ou `TCC-M06` | `localStorage` simula a persistência |
| **Como verifica horário livre?** | `js/model.js` | `TCC-M11` | Função `horariosLivres()` |
| **Como calcula o faturamento?** | `js/model.js` | `TCC-M14` | Função `resumoReceita()` |
| **Onde está o formulário?** | `js/view.js` | `TCC-V11` | Função `telaBarbearia()` |
| **Onde aparece a agenda?** | `js/view.js` | `TCC-V14` | Função `tabelaAgenda()` |
| **Onde aparece o painel?** | `js/view.js` | `TCC-V13` | Função `telaPainel()` |
| **Quem recebe o clique?** | `js/controller.js` | `TCC-C03` | `addEventListener('click')` |
| **Quem confirma o agendamento?** | `js/controller.js` | `TCC-C14` | Evento `submit` do formulário |
| **Quem cria as contas?** | `js/controller.js` | `TCC-C12` ou `TCC-C13` | Cadastro de cliente ou barbeiro |
| **Onde aparecem as avaliações?** | `js/view.js` | `TCC-V16` | Resumo de estrelas e comentários |
| **Onde muda as cores?** | `style.css` | `TCC-CSS02` e `TCC-CSS03` | Variáveis CSS e modo escuro |

## 5. O exemplo mais importante — agendamento completo (MVC)

**Pergunta provável:** "Mostrem uma funcionalidade que passe por Model, View e Controller."

**Etapa 1 — VIEW: mostrar o formulário**

- Abra `js/view.js` e pesquise `TCC-V11`.
- Mostre a função `telaBarbearia(id)`.
- A função monta os campos de serviço, profissional, dia, hora, nome e telefone.
- Ela atualiza os horários com `atualizarHorarios()` (marcador `TCC-V12`).

**Etapa 2 — CONTROLLER: receber a confirmação**

- Abra `js/controller.js` e pesquise `TCC-C14`.
- Mostre o bloco `if (form.id==='form-agendar')`.
- Ele lê os dados do formulário e executa a verificação abaixo.

```js
if (!horariosLivres(b.id,data,profissional).includes(hora)) {
  aviso('Este horário não está mais disponível.');
  atualizarHorarios();
  return;
}
```

- Depois o Controller adiciona um objeto ao array `agendamentos`, chama `salvar()` e exibe a confirmação.

**Etapa 3 — MODEL: regra e armazenamento**

- Abra `js/model.js` e pesquise `TCC-M11`.
- A função `horariosLivres()` verifica se já existe um agendamento confirmado/concluído na mesma data, hora e profissional.
- Pesquise `TCC-M06`: `salvar()` usa `localStorage.setItem()` para armazenar os objetos no navegador.

**Resposta curta para a banca:**

> "Na View, o cliente vê o formulário. O Controller recebe o clique em Confirmar, coleta os dados e chama as regras do Model. O Model verifica a disponibilidade, e o Controller salva a reserva e pede à View para atualizar a tela. Assim separamos as responsabilidades."

## 6. Outro exemplo importante — faturamento

- **Model:** `js/model.js` > `TCC-M14` > `resumoReceita()`.
- **View:** `js/view.js` > `TCC-V17` > `tabelaFaturamento()`.
- **Controller:** `js/controller.js` > `TCC-C04` > clique em **Concluir**.

O cálculo soma **somente atendimentos com status Concluído**, separados por profissional. O faturamento da barbearia também inclui pedidos marcados como **Entregue**.

**Pergunta:** "Por que reservar um horário não aumenta o faturamento?"

**Resposta:** "Porque reserva não significa serviço prestado. O sistema só soma o atendimento quando o barbeiro marca como concluído."

## 7. Perguntas que podem aparecer

**"Vocês fizeram MVC de verdade?"**

> "Fizemos uma separação inspirada no MVC, adaptada ao nosso front-end. Os arquivos são separados por dados e regras, interface e eventos. Não temos MVC completo com backend, porque o servidor e o banco estão fora do escopo deste módulo."

**"Onde está o banco de dados?"**

> "Nesta etapa ainda não temos banco de dados. Usamos localStorage para manter a demonstração em um mesmo navegador. Em produção, isso seria substituído por backend e banco."

**"O login é seguro?"**

> "Não. O login é demonstrativo e as senhas fictícias estão no JavaScript/localStorage. O objetivo é mostrar o fluxo; autenticação segura será tratada em uma etapa futura."

**"Como funciona sem Google Maps?"**

> "Neste módulo, os estabelecimentos são exemplos definidos no Model. A integração com Google Maps ficou para o terceiro módulo."

**"Por que não usaram React ou outra biblioteca?"**

> "Decidimos manter HTML, CSS e JavaScript puro para facilitar o aprendizado e a explicação da arquitetura neste TCC."

**"Qual é a diferença entre HTML, CSS e JavaScript?"**

> "HTML organiza a estrutura da página, CSS define o visual, e JavaScript controla as interações, as regras e os dados da demonstração."

## 8. Como abrir o site para demonstrar

Para mostrar o site no navegador, abra `index.html` na pasta do projeto (clicando duas vezes nele no explorador do sistema). Você também pode usar uma extensão como Live Server no VS Code, se já tiver instalada, para iniciar a página em um servidor local.

**Contas fictícias para a apresentação:**

- Barbeiro: `estacao47` / `demo123`
- Cliente: `cliente` / `demo123`

As contas de demonstração não devem receber dados pessoais reais.

**Dica:** deixe abertas três abas no VS Code — `model.js`, `view.js` e `controller.js`. Assim você troca rapidamente entre as partes quando o professor perguntar.
