# Guia para apresentar o código do BarberSync

## Abrir no VS Code

1. Baixe a pasta ZIP do GitHub e extraia.
2. No VS Code, use **Arquivo → Abrir Pasta**.
3. Abra `index.html`, `style.css` e `js/app.js` no Explorador.
4. Use `Ctrl + F` para buscar um trecho do arquivo e `Ctrl + Shift + F` para pesquisar no projeto.
5. Para ver o site, abra `index.html` no navegador ou rode com a extensão Live Server.

## Organização simplificada

```text
barbersync/
├── index.html          ← estrutura e telas em HTML
├── style.css           ← carrega os arquivos CSS
├── js/
│   └── app.js          ← regras e interações
├── css/                ← estilos separados por área
└── docs/               ← documentação e roteiros
```

### Onde está cada parte?

| Funcionalidade | Código para localizar |
| --- | --- |
| Página inicial e vitrine | `index.html` → `pagina-inicio-vitrine` |
| Card da Estação 47 | `index.html` → `componente-card-vitrine`; dados `estacao47` no JS |
| Perfil da barbearia | `index.html` → `pagina-perfil-barbearia` |
| Serviços e profissionais | `index.html` → `componente-linha-servico`, `componente-card-profissional` |
| Login e cadastro de cliente | `index.html` → `pagina-login-cliente`, `pagina-cadastro-cliente` |
| Cadastro e painel do barbeiro | `index.html` → `pagina-cadastro-barbeiro`, `pagina-painel-barbeiro` |
| Agenda / faturamento / produtos | `index.html` → `painel-agenda`, `painel-faturamento`, `painel-catalogo` |
| Reserva e confirmação | `index.html` → `pagina-perfil-barbearia`, `modal-agendamento-confirmado` |
| Cores, fontes, espaçamento | `style.css` (buscar `VITRINE`, `LOGIN`, `PERFIL`) |
| Dados da Estação 47 | `js/app.js` → `estacao47` |
| Verificar horários disponíveis | `js/app.js` → `horariosLivres()` |
| Processar agendamento | `js/app.js` → `form-agendar` |
| Armazenamento e dados | `js/app.js` → `salvar()` |
| Renderização de telas | `js/app.js` → `htmlTela()`, `renderizar()` |

## Por que os blocos HTML usam `script type="text/html"`?

Esse tipo de `script` é só um **modelo de HTML**, não um programa. O navegador não o executa. Quando alguém entra numa tela, `htmlTela()` pega o conteúdo do modelo e preenche marcadores como `__BS_VAL_0__` com nomes, imagens, avaliações e horários. A página final é inserida no `<main id="app"></main>`. Isso evita colocar dezenas de HTMLs longos dentro do JavaScript e preserva a navegação dinâmica.

## Exemplo do fluxo de agendamento

1. O modelo `pagina-perfil-barbearia` define a interface.
2. A função `horariosLivres()` informa os horários para o profissional e o dia escolhido.
3. O envio de `form-agendar` valida os campos, registra a reserva e chama `salvar()`.
4. A confirmação utiliza `modal-agendamento-confirmado`, também armazenado no HTML.

## Limitações que vocês devem saber explicar

Não existe backend ou banco de dados; os registros ficam somente no navegador. As contas usam login demonstrativo e não são seguras para usuários reais. Pagamentos são simulados. Para produção seriam necessários servidor, autenticação adequada e armazenamento compartilhado.

## Como estudar os estilos

O arquivo `style.css` importa os estilos da pasta `css/`. Consulte `docs/ESTUDO-CSS.md` para entender o que cada arquivo faz e apresentar CSS para a banca.
