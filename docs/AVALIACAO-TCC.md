# Revisão de qualidade — BarberSync

Esta revisão avalia **organização e facilidade de explicação**, não a identidade de quem escreveu o código. A aparência de um arquivo não permite provar ou descartar uso de IA.

## Melhorias feitas na refatoração

- O JavaScript foi separado por área sem criar frameworks ou bibliotecas extras.
- O agendamento, a avaliação e o pedido agora conferem se o navegador conseguiu salvar os dados antes de mostrar confirmação.
- O campo de telefone opcional não depende mais de manipular uma string de HTML já pronta.
- As páginas continuam no HTML, separadas por área, e os nomes das funções principais foram preservados.
- Os comentários explicam o funcionamento real, sem declarações artificiais de autoria.
- Os guias foram corrigidos para usar Live Server, exigido pelo carregamento de templates com `fetch`.

## Como avaliar

| Critério | Peso |
| --- | ---: |
| Organização do HTML | 20% |
| CSS e responsividade | 20% |
| Clareza das funções em JavaScript | 20% |
| Funcionamento e ausência de bugs | 20% |
| Legibilidade e documentação | 10% |
| Capacidade do grupo de explicar o código | 10% |

Para conferir a estrutura, rode `node tests/estrutura.mjs`. Depois teste manualmente login, cadastro, reserva, cancelamento, painel do proprietário, conclusão, cadastro de produto e visualização no celular.

A nota definitiva depende também da demonstração prática e das respostas de cada integrante. Este projeto ainda é um protótipo sem banco de dados e autenticação de produção.

## Testes feitos em navegador — 17/11/2026

Os seguintes testes foram executados em **Chromium headless**, com o site servido por HTTP local, usando dados fictícios. Os resultados não alteraram o site em produção.

| Fluxo testado | Resultado |
| --- | --- |
| Carregar a vitrine com as quatro barbearias | Passou |
| Cadastrar cliente, incluindo telefone opcional e aceite de termos | Passou |
| Registrar agendamento e conferir no localStorage | Passou |
| Impedir o mesmo horário para o mesmo profissional | Passou |
| Exibir e cancelar a reserva na área do cliente | Passou |
| Entrar como proprietário demonstrativo | Passou |
| Abrir agenda, cadastrar produto e concluir atendimento | Passou |
| Abrir página inicial com viewport de 390px sem rolagem horizontal excessiva | Passou |
| Alternar tema e preservar a escolha após atualizar a página | Passou |
| Cadastrar novo proprietário e nova barbearia | Passou |

Também passaram as conferências em `node tests/estrutura.mjs` (sintaxe dos arquivos JS, modelos HTML referenciados e importações CSS). Nenhum erro JavaScript de execução foi capturado durante esses fluxos.

**Limites da verificação:** não foram cobertos todos os formatos de tela, navegadores, falhas de rede ou situações de armazenamento cheio. O site continua demonstrativo.

## Nota técnica simulada

| Critério | Nota | Peso |
| --- | ---: | ---: |
| Organização do HTML | 9,0 | 20% |
| CSS e responsividade | 9,0 | 20% |
| Clareza das funções JavaScript | 8,6 | 20% |
| Funcionamento dos fluxos testados | 9,6 | 20% |
| Legibilidade e documentação | 9,5 | 10% |
| Facilidade de explicar na banca | 9,2 | 10% |

**Média ponderada: 9,11/10 (aproximadamente 9,1).** É uma avaliação simulada, não uma garantia de nota da instituição. O JavaScript ainda contém alguns trechos de montagem dinâmica de HTML que merecem estudo antes da apresentação.
