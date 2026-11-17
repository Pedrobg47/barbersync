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
