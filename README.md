# BarberSync — Protótipo de TCC

**BarberSync** é uma vitrine de barbearias de **Barueri (SP)**. Este projeto demonstra o fluxo de escolha de barbearia, agendamento, avaliações e pedidos, além de um painel simples para o responsável pelo estabelecimento.

> **Importante:** é um **protótipo acadêmico somente de front-end**, e não uma plataforma operacional. As barbearias, notas, comentários e fotos são ilustrativos; não vêm do Google. Não use dados pessoais verdadeiros nos formulários.

## Executar

1. Baixe o repositório ou abra-o no VS Code.
2. Abra o arquivo `index.html` no navegador.
3. Se quiser publicar, importe o repositório na **Vercel**, escolha o framework **Other** e mantenha a pasta de saída padrão (a raiz). Não precisa instalar pacotes nem rodar comandos de build.
4. As fotos externas precisam de conexão com a internet. O restante funciona no navegador.

## Organização do código

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Estrutura básica, cabeçalho, menu e rodapé. |
| `style.css` | Cores, cartões, formulários, aparência e responsividade. |
| `script.js` | Dados fictícios, montagem das telas e eventos de botões/formulários. |
| `README.md` | Explicação e roteiro para a apresentação. |

**Tecnologias:** HTML, CSS e JavaScript puro, sem React, sem bibliotecas, sem API, sem servidor e sem banco de dados.

### Como funciona

- O site usa **hash na URL** para trocar de tela: `#inicio`, `#barbearia/estacao47`, `#meus-agendamentos` e `#painel`.
- O array `barbearias` contém as informações usadas para desenhar os cards e perfis.
- `filter()` e `sort()` fazem a busca e a ordenação da vitrine.
- Um formulário de agendamento usa data, horário, serviço e profissional. O JavaScript verifica horários já registrados **neste navegador** para evitar duplicações locais.
- A função `salvar()` usa `localStorage`, um armazenamento simples do próprio navegador, para persistir barbearias, pedidos, agendamentos e avaliações.
- O painel lê esses mesmos dados e mostra os agendamentos, avaliações, produtos e valores de pedidos de demonstração.
- Na aba **Personalizar**, é possível trocar cor, nome, descrição, horário exibido e profissionais. Na aba **Produtos**, é possível cadastrar ou excluir produtos.
- O botão **Restaurar dados da demonstração** limpa os registros locais e volta aos exemplos iniciais.

## Roteiro de apresentação (5 a 8 minutos)

1. **Vitrine:** abra a página inicial, busque uma barbearia, filtre por bairro e ordene pelas avaliações.
2. **Perfil:** abra a Estação 47 Barber, mostre a galeria, serviços, preços, profissionais e horário de funcionamento.
3. **Reserva:** escolha um dia, horário e profissional e registre um agendamento com dados inventados.
4. **Área do barbeiro:** entre no painel e mostre o agendamento na agenda.
5. **Personalização:** mude a cor principal da barbearia, salve e volte à página dela para mostrar a mudança.
6. **Avaliações e compras:** publique uma avaliação de demonstração, faça um pedido fictício de produto e mostre-o no painel.
7. **Cadastro:** cadastre uma nova barbearia e confirme que ela aparece na vitrine.

## Perguntas que professores podem fazer

**Por que não usaram banco de dados?**  
Porque o objetivo do TCC nesta versão é demonstrar o fluxo e a interface do usuário. O `localStorage` permite simular o armazenamento sem infraestrutura de servidor.

**Como a busca funciona?**  
O código pega as barbearias de um array, filtra pelo texto ou bairro e desenha os cards que correspondem à busca.

**O agendamento é real?**  
Não. Ele funciona como protótipo apenas neste navegador. Outro dispositivo não vê a reserva e, sem servidor, não existe controle global de disponibilidade.

**Como o dono muda o design da página?**  
Um formulário edita os campos da barbearia e salva no `localStorage`. A página usa a cor salva na variável CSS `--accent`.

**As avaliações são importadas do Google?**  
Não. Os exemplos foram criados para a apresentação. Para exibir dados reais do Google seria necessário adicionar uma integração autorizada pela **Places API**, com chave, configurações de faturamento e regras de atribuição. Isso seria uma etapa futura separada.

**O sistema possui login, autenticação ou pagamento de verdade?**  
Não. O acesso à área do dono é aberto **apenas para demonstração**; não existe autenticação, autorização, processamento de pagamentos ou comunicação com WhatsApp.

## Limitações conscientes

- Não sincroniza dados entre computadores, navegadores ou dispositivos.
- Não envia e-mails, mensagens ou notificações.
- Não faz pagamentos, reservas operacionais ou vendas reais.
- Não busca fotos nem avaliações automaticamente do Google.
- O campo de horário de funcionamento é **informativo**; a demonstração de horários usa a regra fixa de segunda a sexta, 09h–19h; sábado, 09h–17h; domingo, fechado.
- Não exige cadastro de usuário, nem garante a identidade de quem está acessando o painel.

**Futuras melhorias** (fora do escopo do TCC): login e permissões, banco de dados, disponibilidade de horários centralizada, integração oficial com o Google Places e pagamentos seguros.

---
Feito para ser **simples de estudar, explicar e demonstrar**.