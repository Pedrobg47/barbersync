# BarberSync

Protótipo web de barbearias feito com HTML, CSS e JavaScript.

## Como abrir

1. Abra a pasta do projeto no Visual Studio Code.
2. Abra `index.html` no navegador.
3. Se quiser testar com servidor local, use a extensão Live Server do VS Code.

## Arquivos

- `index.html`: estrutura do site e elemento `#app`.
- `style.css`: aparência do site. Pesquise por **VITRINE**, **PERFIL DA BARBEARIA**, **LOGIN** e **CABEÇALHO**.
- `js/app.js`: dados de exemplo, telas, formulários e eventos.
- `docs/`: orientações e roteiros de apresentação.

## Funções importantes

| O que localizar | Onde procurar |
| --- | --- |
| Barbearias de exemplo, incluindo Estação 47 | `EXEMPLOS` ou `estacao47` em `js/app.js` |
| Página inicial e vitrine | `telaInicio()` |
| Perfil da barbearia | `telaBarbearia()` |
| Disponibilidade de horários | `horariosLivres()` |
| Agendamentos | `form-agendar` |
| Painel da barbearia | `telaPainel()` |
| Faturamento demonstrativo | `resumoReceita()` |
| Mudança de tela | `renderizar()` |

## Limitações desta versão

É uma demonstração local, sem banco de dados ou servidor. Os cadastros, agendamentos e pedidos ficam no navegador através de `localStorage`. As contas e senhas de demonstração não implementam autenticação segura. Os pagamentos são simulados e algumas imagens dependem de conexão com a internet. Uma versão real precisaria de backend, banco de dados, autenticação adequada e integração com serviços externos.
