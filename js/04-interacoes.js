// Eventos de clique, teclado, busca e seleção.

document.addEventListener('click',e=>{
  const el=e.target;
  const card=el.closest('[data-loja]');
  if (card) location.hash='#barbearia/'+card.dataset.loja;
  if (el.closest('#theme-toggle')) {
    const novo=document.body.classList.contains('theme-dark')?'claro':'escuro';
    localStorage.setItem(CHAVE+'tema',novo);
    aplicarTema();
  }
  if (el.closest('[data-fechar]')||el.classList.contains('modal-backdrop')) fecharModal();
  const tipo=el.closest('[data-tipo]');
  if (tipo) {
    filtro.tipo=tipo.dataset.tipo;
    document.querySelectorAll('[data-tipo]').forEach(b=>b.classList.toggle('active',b===tipo));
    atualizarCards();
  }
  if (el.id==='limpar-filtros') { filtro={busca:'',bairro:'Todos',ordenacao:'nota',tipo:'Todos'}; telaInicio(); }
  const aval=el.closest('[data-avaliar]'); if (aval) modalAvaliacao(aval.dataset.avaliar);
  const comprar=el.closest('[data-comprar]'); if (comprar) modalCompra(comprar.dataset.comprar,comprar.dataset.produto);
  const aba=el.closest('[data-aba]'); if (aba) { abaPainel=aba.dataset.aba; telaPainel(); }
  if (el.closest('[data-cadastrar]') && donoLogado()) modalCadastro();
  if (el.closest('[data-exemplos]') && podeEditar(loja(barbeariaPainel))) {
    const inseriu=inserirExemplosLoja(loja(barbeariaPainel));
    if (inseriu) {
      salvar();
      telaPainel();
      aviso('Dados fictícios adicionados para a apresentação.');
    }
    else aviso('Já existem agendamentos nesta barbearia.');
  }
  if (el.closest('[data-logout]')) {
    sessionStorage.removeItem(CHAVE+'dono');
    location.hash='#login';
    renderizar();
    aviso('Sessão do barbeiro encerrada.');
  }
  if (el.closest('[data-logout-cliente]')) {
    sessionStorage.removeItem(CHAVE+'cliente');
    location.hash='#login-cliente';
    renderizar();
    aviso('Sessão do cliente encerrada.');
  }
  const edit=el.closest('[data-editar-loja]');
  if (edit && podeEditar(loja(edit.dataset.editarLoja))) {
    barbeariaPainel=edit.dataset.editarLoja;abaPainel='aparencia';location.hash='#painel';
  }
  const concluir=el.closest('[data-concluir]');
  if (concluir && donoLogado()) {
    const ag=agendamentos.find(a=>String(a.id)===concluir.dataset.concluir);
    if (ag && ag.status==='Confirmado' && podeEditar(loja(ag.idLoja))) {
      ag.status='Concluído';salvar();telaPainel();aviso('Atendimento concluído e faturamento atualizado.');
    }
  }
  const entregar=el.closest('[data-entregar]');
  if (entregar && donoLogado()) {
    const pedido=pedidos.find(p=>String(p.id)===entregar.dataset.entregar);
    if (pedido && pedido.status!=='Entregue' && podeEditar(loja(pedido.idLoja))) {
      pedido.status='Entregue';salvar();telaPainel();aviso('Pedido entregue e faturamento atualizado.');
    }
  }
  const removerGaleria=el.closest('[data-remover-galeria]');
  if (removerGaleria && podeEditar(loja(barbeariaPainel))) {
    const b=loja(barbeariaPainel),i=Number(removerGaleria.dataset.removerGaleria);
    if (b.fotos.length>1 && i>=0 && i<b.fotos.length) {
      b.fotos.splice(i,1);salvar();telaPainel();aviso('Foto removida.');
    }
  }
  const removerProf=el.closest('[data-remover-foto-prof]');
  if (removerProf && podeEditar(loja(barbeariaPainel))) {
    const b=loja(barbeariaPainel);
    if (b.fotosProfissionais) delete b.fotosProfissionais[removerProf.dataset.removerFotoProf];
    salvar();telaPainel();aviso('Foto do profissional removida.');
  }
// e devolve o horário à lista de horários disponíveis.
  const cancel=el.closest('[data-cancelar]');
  if (cancel && confirm('Cancelar este agendamento de demonstração?')) {
    const a=agendamentos.find(x=>String(x.id)===cancel.dataset.cancelar);
    const permitido=!!a && (clienteLogado()?a.clienteUsuario===clienteLogado():!a.clienteUsuario&&!a.exemplo);
    if (permitido && a.status==='Confirmado') {
      a.status='Cancelado'; salvar();
      if(location.hash==='#conta-cliente') telaContaCliente(); else telaMeusAgendamentos();
      aviso('Agendamento cancelado.');
    }
  }
  const remover=el.closest('[data-remover-produto]');
  if (remover && podeEditar(loja(barbeariaPainel))) {
    const b=loja(barbeariaPainel);
    b.produtos=b.produtos.filter(p=>p.id!==remover.dataset.removerProduto);
    salvar();
    telaPainel();
    aviso('Produto excluído.');
  }
  if (el.closest('[data-reset]') && podeEditar(loja(barbeariaPainel)) && confirm('Restaurar os dados de teste desta barbearia?')) {
    const b=loja(barbeariaPainel);
    agendamentos=agendamentos.filter(a=>a.idLoja!==b.id);
    pedidos=pedidos.filter(p=>p.idLoja!==b.id);
    const original=EXEMPLOS.find(x=>x.id===b.id);
    if(original) Object.assign(b,JSON.parse(JSON.stringify(original)));
    inserirExemplosLoja(b);
    salvar();abaPainel='visao';telaPainel();aviso('Demonstração restaurada nesta barbearia.');
  }
});
document.addEventListener('keydown',e=>{
  if (e.key==='Escape') fecharModal();
  if ((e.key==='Enter'||e.key===' ') && e.target.matches('[data-loja]')) {
    e.preventDefault();
    location.hash='#barbearia/'+e.target.dataset.loja;
  }
});
document.addEventListener('input',e=>{
  if (e.target.id==='busca') {
    filtro.busca=e.target.value;
    atualizarCards();
  }
});
document.addEventListener('change',e=>{
  if (e.target.matches('#upload-capa,#upload-galeria,[data-upload-prof],[data-upload-prod]')) {
    receberFotos(e.target);return;
  }
  if (e.target.id==='bairro') {
    filtro.bairro=e.target.value;
    atualizarCards();
  }
  if (e.target.id==='ordenacao') {
    filtro.ordenacao=e.target.value;
    atualizarCards();
  }
  if (['servico','profissional','dia'].includes(e.target.id)) atualizarHorarios();
  if (e.target.id==='selecionar-loja' && minhasLojas().some(b=>b.id===e.target.value)) {
    barbeariaPainel=e.target.value;
    telaPainel();
  }
});
// submit é o envio de um formulário. e.preventDefault() evita recarregar.
