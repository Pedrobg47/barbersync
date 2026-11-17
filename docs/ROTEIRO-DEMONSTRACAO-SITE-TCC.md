# Sequência prática da demonstração

## Antes da apresentação

Abra o projeto com **Live Server** (ou Vercel) e a pasta no VS Code. Deixe `templates/01-paginas.html`, `js/01-dados.js`, `js/02-telas.js` e `js/05-formularios.js` prontos para pesquisa. Verifique se os cadastros de demonstração que serão usados estão no navegador da apresentação.

## Sequência sugerida

1. **Início:** explique o objetivo do BarberSync; mostre a vitrine e filtre barbearias.
2. **Perfil:** clique em **Estação 47**. Mostre fotos, equipe, serviços, produtos e avaliações.
3. **Cliente:** faça login de demonstração ou crie uma conta fictícia. Mostre a área do cliente.
4. **Agendamento:** escolha um serviço, profissional e horário, e confirme. Abra a área de agendamentos para mostrar o registro.
5. **Barbeiro:** entre como proprietário da barbearia de exemplo e abra o painel. Mostre a agenda e, se apropriado, conclua um atendimento.
6. **Gestão:** mostre edição de informações, equipe, imagens e produtos. Explique o faturamento demonstrativo.
7. **Planos:** apresente a proposta dos planos e ressalte que não existe cobrança real.
8. **Código:** no VS Code, pesquise `telaInicio()` e `telaBarbearia()` em `js/02-telas.js`, `form-agendar` em `js/05-formularios.js` e `.shop-card` em `css/02-inicio-e-vitrine.css`.
9. **Conclusão:** explique que o site demonstra a experiência de uso, mas precisaria de backend, autenticação e banco de dados para operação real.

## Exemplos de pesquisa rápida

- `estacao47` — dados da barbearia de exemplo
- `horariosLivres()` — disponibilidade
- `form-agendar` — envio da reserva
- `salvar()` — persistência local
- `resumoReceita()` — valores demonstrativos
- `VITRINE` — formatação dos cards
- `PERFIL DA BARBEARIA` — estilos usados na página da loja

**Se a internet falhar:** o JavaScript e o CSS locais ainda podem ser apresentados no VS Code. As fotos externas podem ficar indisponíveis.
