# Roteiro de apresentação — 5 integrantes

Objetivo: cada integrante explica uma parte verdadeira do projeto e demonstra uma função na tela. Todos devem entender o básico, em vez de depender apenas de falas decoradas.

## Pessoa 1 — Apresentação, menu e vitrine

**Fala sugerida:** "O BarberSync é um protótipo para descobrir barbearias e acessar serviços e horários. Na página inicial aparecem alguns estabelecimentos de exemplo, com fotos e avaliações demonstrativas."

**Mostrar:** página inicial, vitrine e filtros.

**No VS Code:** `templates/01-paginas.html`, `telaInicio()` em `js/02-telas.js`, `EXEMPLOS` em `js/01-dados.js` e `css/02-inicio-e-vitrine.css`.

**Perguntas para estudar:** Como os cards são criados? Como os filtros alteram o que aparece?

## Pessoa 2 — Cadastro e login

**Fala sugerida:** "Criamos formulários separados para clientes e barbeiros. Como é uma demonstração local, os dados são guardados no navegador, sem autenticação de servidor."

**Mostrar:** entrar como cliente, cadastro de cliente e cadastro de barbeiro.

**No VS Code:** `telaLoginCliente()` e `telaCadastroBarbeiro()` em `js/02-telas.js`; formulários em `js/05-formularios.js`.

**Perguntas para estudar:** Onde os cadastros ficam salvos? Por que o login não é adequado para produção?

## Pessoa 3 — Perfil da barbearia e agendamento

**Fala sugerida:** "Ao abrir uma barbearia, vemos seus serviços, profissionais e horários. O cliente escolhe o atendimento e envia uma solicitação de agendamento."

**Mostrar:** Estação 47, escolha de serviço, profissional e horário.

**No VS Code:** `telaBarbearia()` em `js/02-telas.js`, `horariosLivres()` em `js/01-dados.js` e `form-agendar` em `js/05-formularios.js`.

**Perguntas para estudar:** Como os horários disponíveis são calculados? O que acontece ao confirmar a reserva?

## Pessoa 4 — Painel do barbeiro

**Fala sugerida:** "O painel permite acompanhar a agenda e administrar informações da barbearia. Há ações para concluir atendimentos e visualizar dados demonstrativos."

**Mostrar:** acesso do proprietário, painel, agenda, produtos e personalização.

**No VS Code:** `telaPainel()` e `tabelaAgenda()` em `js/02-telas.js`; `resumoReceita()` em `js/01-dados.js`.

**Perguntas para estudar:** Como concluir um agendamento? Como o painel calcula o faturamento demonstrativo?

## Pessoa 5 — Área do cliente, planos e limitações

**Fala sugerida:** "A área do cliente reúne seus registros e agendamentos. O projeto também mostra planos comerciais ilustrativos. Como próximos passos, seria necessário adicionar servidor e banco de dados para uso real."

**Mostrar:** conta de cliente, meus agendamentos, planos e políticas.

**No VS Code:** `telaContaCliente()`, `telaMeusAgendamentos()` e `telaPlanos()` em `js/02-telas.js`; `renderizar()` em `js/03-navegacao.js`.

**Perguntas para estudar:** Como funciona a navegação? O que falta para permitir uso por pessoas em computadores diferentes?

## Limitações reais para apresentar

- Não há banco de dados nem backend; o armazenamento é local ao navegador.
- Login e senhas são de demonstração, não seguros para uso real.
- Pagamentos são apenas ilustrativos.
- Algumas fotos externas dependem de internet.

Não é necessário criar erros artificiais: essas limitações já demonstram o que foi construído e o que ainda falta desenvolver.
