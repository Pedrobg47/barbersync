# Guia rápido para localizar o código no VS Code

Abra a pasta inteira do BarberSync com **Arquivo → Abrir Pasta**.

## Estrutura

```text
barbersync/
├── index.html
├── style.css
├── js/
│   └── app.js
└── docs/
    ├── README.md
    ├── GUIA-VSCODE-TCC.md
    ├── ROTEIRO-APRESENTACAO-TCC.md
    └── ROTEIRO-DEMONSTRACAO-SITE-TCC.md
```

## Como localizar uma funcionalidade

Use `Ctrl+F` no arquivo aberto ou `Ctrl+Shift+F` na pasta inteira.

| Tema | Pesquisar |
| --- | --- |
| Estação 47 | `estacao47` |
| Lista de barbearias | `EXEMPLOS` ou `telaInicio()` |
| Cards da vitrine | `VITRINE` em `style.css` |
| Perfil da barbearia | `telaBarbearia()` |
| Login de barbeiro | `telaLogin()` |
| Login de cliente | `telaLoginCliente()` |
| Cadastro de cliente | `telaCadastroCliente()` |
| Cadastro de barbeiro | `telaCadastroBarbeiro()` |
| Horários livres | `horariosLivres()` |
| Envio de agendamento | `form-agendar` |
| Agenda no painel | `tabelaAgenda()` |
| Receita demonstrativa | `resumoReceita()` |
| Ações de botões | `addEventListener('click'` |
| Navegação | `renderizar()` |

## Entenda o fluxo de um agendamento

1. `telaBarbearia()` monta a interface da barbearia.
2. `horariosLivres()` ajuda a mostrar horários disponíveis.
3. O evento de envio do formulário `form-agendar` lê os campos e valida a escolha.
4. O agendamento é incluído nos dados em memória e `salvar()` grava a alteração no armazenamento local.
5. O navegador mostra a confirmação e a interface é atualizada.

## Explicação técnica importante

A interface é gerada dinamicamente dentro de `<main id="app"></main>`, no `index.html`. O CSS define o visual, e o JavaScript contém os dados e os comportamentos.

Os dados desta versão não ficam disponíveis em todos os computadores. A aplicação não tem backend nem banco de dados e não deve ser usada com senhas reais.
