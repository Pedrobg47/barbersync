/* MVC — CONTROLLER (Controlador): clique, formulários e navegação.
   Exemplo: ao confirmar agendamento, valida dados, salva no Model e redesenha a View. */

// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-C01] FOTOS — ação que recebe arquivos do proprietário    ║
// ╚══════════════════════════════════════════════════════════════╝
// Recebe foto, pede ao Model para compactar, salva e atualiza o painel.
async function receberFotos(input) {
  if (!donoLogado()) return;
  const b=loja(barbeariaPainel);
  if (!podeEditar(b)) return;
  const antigos={capa:b.capa,fotos:[...b.fotos],fotosProfissionais:{...(b.fotosProfissionais||{})},produtos:b.produtos.map(p=>({...p}))};
  try {
    const arquivos=[...input.files];
    if (!arquivos.length) return;
    if (input.id==='upload-galeria' && b.fotos.length+arquivos.length>6) {
      throw new Error('A galeria permite no máximo 6 fotos. Exclua algumas antes.');
    }
    for (const arquivo of arquivos) {
      const tamanho=input.hasAttribute('data-upload-prof')||input.hasAttribute('data-upload-prod')?500:1000;
      const foto=await comprimirFoto(arquivo,tamanho);
      if (input.hasAttribute('data-upload-prod')) {
        const produto=b.produtos.find(p=>p.id===input.dataset.uploadProd);
        if (!produto) throw new Error('Produto não encontrado.');
        produto.imagem=foto;
      } else if (input.id==='upload-capa') b.capa=foto;
      else if (input.id==='upload-galeria') b.fotos.push(foto);
      else if (input.hasAttribute('data-upload-prof')) {
        b.fotosProfissionais ||= {};
        b.fotosProfissionais[input.dataset.uploadProf]=foto;
      }
    }
    if (!salvar()) throw new Error('Sem espaço suficiente. Tente fotos menores.');
    telaPainel();
    aviso('Fotos atualizadas na sua vitrine!');
  } catch (erro) {
    Object.assign(b,antigos);
    salvar();
    aviso(erro.message || 'Não foi possível adicionar a imagem.');
  }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-C02] ROTAS — qual tela abrir ao navegar no site           ║
// ╚══════════════════════════════════════════════════════════════╝
// A URL #inicio, #painel, #barbearia/id etc. determina qual View usar.
function renderizar() {
  fecharModal();
  const rota=decodeURIComponent(location.hash||'#inicio');
  atualizarCabecalho();
  if (rota.startsWith('#barbearia/')) telaBarbearia(rota.split('/')[1]);
  else if (rota==='#painel') telaPainel();
  else if (rota==='#login') telaLogin();
  else if (rota==='#login-cliente') telaLoginCliente();
  else if (rota==='#cadastro-cliente') telaCadastroCliente();
  else if (rota.startsWith('#cadastro-barbeiro')) telaCadastroBarbeiro();
  else if (rota==='#conta-cliente') telaContaCliente();
  else if (rota==='#planos') telaPlanos();
  else if (rota==='#politicas') telaPoliticas();
  else if (rota==='#meus-agendamentos') telaMeusAgendamentos();
  else telaInicio();
  window.scrollTo(0,0);
}

// 7. Eventos: todos os cliques e formulários passam por estes ouvintes.
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-C03] CLIQUES — botões, cards, ações do painel             ║
// ╚══════════════════════════════════════════════════════════════╝
// O Controller escuta um clique e decide qual regra executar.
document.addEventListener('click',e=>{
  const el=e.target;
  const card=el.closest('[data-loja]');
  if (card) location.hash='#barbearia/'+card.dataset.loja;
  if (el.closest('#theme-toggle')) { const novo=document.body.classList.contains('theme-dark')?'claro':'escuro'; localStorage.setItem(CHAVE+'tema',novo); aplicarTema(); }
  if (el.closest('[data-fechar]')||el.classList.contains('modal-backdrop')) fecharModal();
  const tipo=el.closest('[data-tipo]');
  if (tipo) { filtro.tipo=tipo.dataset.tipo; document.querySelectorAll('[data-tipo]').forEach(b=>b.classList.toggle('active',b===tipo)); atualizarCards(); }
  if (el.id==='limpar-filtros') { filtro={busca:'',bairro:'Todos',ordenacao:'nota',tipo:'Todos'}; telaInicio(); }
  const aval=el.closest('[data-avaliar]'); if (aval) modalAvaliacao(aval.dataset.avaliar);
  const comprar=el.closest('[data-comprar]'); if (comprar) modalCompra(comprar.dataset.comprar,comprar.dataset.produto);
  const aba=el.closest('[data-aba]'); if (aba) { abaPainel=aba.dataset.aba; telaPainel(); }
  if (el.closest('[data-cadastrar]') && donoLogado()) modalCadastro();
  if (el.closest('[data-exemplos]') && podeEditar(loja(barbeariaPainel))) {
    const inseriu=inserirExemplosLoja(loja(barbeariaPainel));
    if(inseriu) {salvar();telaPainel();aviso('Dados fictícios adicionados para a apresentação.');}
    else aviso('Já existem agendamentos nesta barbearia.');
  }
  if (el.closest('[data-logout]')) {sessionStorage.removeItem(CHAVE+'dono');location.hash='#login';renderizar();aviso('Sessão do barbeiro encerrada.');}
  if (el.closest('[data-logout-cliente]')) {sessionStorage.removeItem(CHAVE+'cliente');location.hash='#login-cliente';renderizar();aviso('Sessão do cliente encerrada.');}
  const edit=el.closest('[data-editar-loja]');
  if (edit && podeEditar(loja(edit.dataset.editarLoja))) {
    barbeariaPainel=edit.dataset.editarLoja;abaPainel='aparencia';location.hash='#painel';
  }
  // [TCC-C04] Ao clicar Concluir, altera status do agendamento.
// O Model resumoReceita() contará esse atendimento no faturamento.
  const concluir=el.closest('[data-concluir]');
  if (concluir && donoLogado()) {
    const ag=agendamentos.find(a=>String(a.id)===concluir.dataset.concluir);
    if (ag && ag.status==='Confirmado' && podeEditar(loja(ag.idLoja))) {
      ag.status='Concluído';salvar();telaPainel();aviso('Atendimento concluído e faturamento atualizado.');
    }
  }
  // [TCC-C05] Um produto só entra no faturamento quando for Entregue.
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
  // [TCC-C06] Cancelamento por cliente: confirma identidade da conta local
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
  if (remover && podeEditar(loja(barbeariaPainel))) { const b=loja(barbeariaPainel); b.produtos=b.produtos.filter(p=>p.id!==remover.dataset.removerProduto); salvar(); telaPainel(); aviso('Produto excluído.'); }
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
  if ((e.key==='Enter'||e.key===' ') && e.target.matches('[data-loja]')) { e.preventDefault(); location.hash='#barbearia/'+e.target.dataset.loja; }
});
// [TCC-C07] Busca instantânea enquanto o usuário digita no campo.
document.addEventListener('input',e=>{
  if (e.target.id==='busca') { filtro.busca=e.target.value; atualizarCards(); }
});
// [TCC-C08] Mudanças de filtros, data, profissional ou arquivos enviados.
// Aqui o Controller pode pedir à View para atualizar a lista de horários.
document.addEventListener('change',e=>{
  if (e.target.matches('#upload-capa,#upload-galeria,[data-upload-prof],[data-upload-prod]')) {
    receberFotos(e.target);return;
  }
  if (e.target.id==='bairro') { filtro.bairro=e.target.value; atualizarCards(); }
  if (e.target.id==='ordenacao') { filtro.ordenacao=e.target.value; atualizarCards(); }
  if (['servico','profissional','dia'].includes(e.target.id)) atualizarHorarios();
  if (e.target.id==='selecionar-loja' && minhasLojas().some(b=>b.id===e.target.value)) { barbeariaPainel=e.target.value; telaPainel(); }
});
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-C09] FORMULÁRIOS — PRINCIPAL PARTE PARA EXPLICAR NA BANCA║
// ╚══════════════════════════════════════════════════════════════╝
// submit é o envio de um formulário. e.preventDefault() evita recarregar.
// Depois o Controller identifica QUAL formulário foi enviado.
document.addEventListener('submit',e=>{
  const form=e.target;
  if (!['form-login','form-login-cliente','form-cadastro-cliente','form-cadastro-barbeiro','form-agendar','form-avaliacao','form-compra','form-cadastro','form-aparencia','form-produto'].includes(form.id)) return;
  e.preventDefault();
  // [TCC-C10] Login do barbeiro: confere usuário/senha de exemplo e
  // guarda a sessão temporária com sessionStorage. NÃO é autenticação real.
  if (form.id==='form-login') {
    const usuario=document.querySelector('#login-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#login-senha').value;
    const conta=contaBarbeiro(usuario);
    if(conta && conta.senha!==senha) {aviso('Usuário ou senha de demonstração incorretos.');return;}
    if (!conta) {aviso('Usuário ou senha de demonstração incorretos.');return;}
    sessionStorage.setItem(CHAVE+'dono',conta.usuario);
    barbeariaPainel=(barbearias.find(b=>(b.dono||b.id)===conta.usuario)||{}).id||conta.usuario;
    abaPainel='visao';
    location.hash='#painel';
    renderizar();
    aviso('Bem-vindo ao painel de '+conta.nome+'!');
    return;
  }
  // [TCC-C11] Login do cliente: registra a conta fictícia na sessão.
  if (form.id==='form-login-cliente') {
    const usuario=document.querySelector('#cliente-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#cliente-senha').value;
    const conta=[...CONTAS_CLIENTE_DEMO,...contasClientes].find(c=>c.usuario===usuario && c.senha===senha);
    if(!conta) {aviso('Usuário ou senha de demonstração incorretos.');return;}
    sessionStorage.setItem(CHAVE+'cliente',conta.usuario);
    location.hash='#conta-cliente';renderizar();aviso('Login de cliente realizado!');
    return;
  }
  // [TCC-C12] Cadastro do cliente: valida campos, grava em localStorage
  // (por salvar()) e abre a tela Minha Conta.
  if(form.id==='form-cadastro-cliente') {
    const nome=document.querySelector('#cliente-nome').value.trim();
    const usuario=document.querySelector('#novo-cliente-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#novo-cliente-senha').value;
    const telefone=document.querySelector('#novo-cliente-telefone').value.trim();
    if(!nome || !/^[a-z0-9_]{4,24}$/.test(usuario) || senha.length<4) {
      aviso('Preencha nome, usuário (4 a 24 caracteres, sem espaços) e senha com 4 caracteres.');return;
    }
    if([...CONTAS_CLIENTE_DEMO,...contasClientes].some(c=>c.usuario===usuario)) {
      aviso('Este usuário de cliente já existe.');return;
    }
    contasClientes.push({nome,usuario,senha,telefone});
    if(!salvar()) {contasClientes.pop();return;}
    sessionStorage.setItem(CHAVE+'cliente',usuario);
    location.hash='#conta-cliente';renderizar();aviso('Conta de cliente de demonstração criada!');
    return;
  }
  // [TCC-C13] Cadastro do barbeiro: cria conta e nova vitrine na lista
  // de barbearias do Model; plano mensal não tem cobrança real.
  if(form.id==='form-cadastro-barbeiro') {
    const nome=document.querySelector('#dono-nome').value.trim();
    const usuario=document.querySelector('#dono-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#dono-senha').value;
    const nomeLoja=document.querySelector('#dono-barbearia').value.trim();
    const bairro=document.querySelector('#dono-bairro').value;
    const plano=document.querySelector('#dono-plano').value;
    if(!nome||!nomeLoja||!/^[a-z0-9_]{4,24}$/.test(usuario)||senha.length<4) {
      aviso('Preencha nome, usuário (4 a 24 caracteres, sem espaços) e senha com 4 caracteres.');return;
    }
    if(contaBarbeiro(usuario)) {aviso('Este usuário de barbeiro já existe.');return;}
    if(!PLANOS.some(p=>p.id===plano)) {aviso('Selecione um plano da demonstração.');return;}
    const nova=criarExemplo('loja'+Date.now(),nomeLoja,bairro,4,0,0,'Bem-vindo à nossa barbearia!', '#d8aa56',['Barbeiro 1'],false);
    nova.avaliacoes=[];nova.dono=usuario;nova.plano=plano;
    contasBarbeiros.push({nome,usuario,senha,plano});
    barbearias.push(nova);
    if(!salvar()) {contasBarbeiros.pop();barbearias.pop();return;}
    sessionStorage.setItem(CHAVE+'dono',usuario);
    barbeariaPainel=nova.id;abaPainel='visao';
    location.hash='#painel';renderizar();aviso('Barbearia criada! Personalize sua vitrine.');
    return;
  }
  if (['form-cadastro','form-aparencia','form-produto'].includes(form.id) && !podeEditar(loja(barbeariaPainel))) {
    aviso('Faça login como proprietário para editar.');return;
  }
  // ╔════════════════════════════════════════════════════════════╗
  // ║ [TCC-C14] AGENDAMENTO — FLUXO MVC COMPLETO                  ║
  // ╚════════════════════════════════════════════════════════════╝
  // 1) View desenhou o formulário em telaBarbearia().
  // 2) Controller lê serviço, profissional, data e hora abaixo.
  // 3) Model horariosLivres() verifica se essa vaga ainda existe.
  // 4) Controller adiciona o objeto ao array agendamentos.
  // 5) Model salvar() persiste no navegador.
  // 6) View telaBarbearia() e modal mostram o resultado.
  // DICA: aponte as linhas abaixo e descreva cada um desses passos.
  if (form.id==='form-agendar') {
    const b=loja(location.hash.split('/')[1]);
    const servico=b.servicos[Number(document.querySelector('#servico').value)];
    const profissional=document.querySelector('#profissional').value;
    const data=document.querySelector('#dia').value;
    const hora=document.querySelector('#hora').value;
    if (!horariosLivres(b.id,data,profissional).includes(hora)) { aviso('Este horário não está mais disponível.'); atualizarHorarios(); return; }
    const cliente=document.querySelector('#nome-cliente').value.trim(), telefone=document.querySelector('#telefone-cliente').value.trim();
    if (!cliente||!telefone) return;
    agendamentos.push({id:Date.now(),idLoja:b.id,cliente:cliente,clienteUsuario:clienteLogado()||'',telefone:telefone,servico:servico.nome,profissional:profissional,data:data,hora:hora,preco:servico.preco,status:'Confirmado'});
    salvar(); telaBarbearia(b.id);
    abrirModal(cabecalhoModal('Agendamento registrado!')+'<p>Seu horário de demonstração foi registrado em <strong>'+seguro(b.nome)+'</strong>, dia <strong>'+dataBR(data)+'</strong> às <strong>'+seguro(hora)+'</strong>.</p><a class="btn btn-primary btn-block" href="#meus-agendamentos">Ver meus agendamentos →</a>');
    aviso('Horário registrado com sucesso!');
  }
  // [TCC-C15] Avaliação: adiciona comentário e nota na barbearia,
  // salva localmente e pede à View que atualize a tela.
  if (form.id==='form-avaliacao') {
    const b=loja(form.dataset.id);
    b.avaliacoes.push({nome:document.querySelector('#avaliador').value.trim(),estrelas:Number(document.querySelector('#estrelas').value),texto:document.querySelector('#comentario').value.trim()});
    salvar(); fecharModal(); telaBarbearia(b.id); aviso('Avaliação publicada nesta demonstração.');
  }
  // [TCC-C16] Pedido fictício de produto (sem pagamento real).
  if (form.id==='form-compra') {
    const b=loja(form.dataset.id),p=b.produtos.find(x=>x.id===form.dataset.produto);
    pedidos.push({id:Date.now(),idLoja:b.id,produto:p.nome,preco:p.preco,cliente:document.querySelector('#comprador').value.trim(),telefone:document.querySelector('#tel-comprador').value.trim()});
    salvar(); fecharModal(); aviso('Pedido simulado registrado! Confira no painel.');
  }
  if (form.id==='form-cadastro') {
    const novo=criarExemplo('loja'+Date.now(),document.querySelector('#cad-nome').value.trim(),document.querySelector('#cad-bairro').value,4,0,0,document.querySelector('#cad-descricao').value.trim(),'#c99457',['Profissional 1'],false);
    novo.avaliacoes=[];novo.dono=donoLogado();
    barbearias.push(novo); barbeariaPainel=novo.id; abaPainel='aparencia';
    salvar(); fecharModal(); telaPainel(); aviso('Barbearia adicionada à vitrine!');
  }
  // [TCC-C17] Personalização: salva nome, bairro, profissionais e cores.
  if (form.id==='form-aparencia') {
    const b=loja(barbeariaPainel);
    const pessoas=document.querySelector('#editar-profissionais').value.split(',').map(x=>x.trim()).filter(Boolean);
    if (!pessoas.length) { aviso('Informe pelo menos um profissional.'); return; }
    Object.assign(b,{nome:document.querySelector('#editar-nome').value.trim(),bairro:document.querySelector('#editar-bairro').value.trim(),cor:document.querySelector('#editar-cor').value,descricao:document.querySelector('#editar-descricao').value.trim(),horario:document.querySelector('#editar-horario').value.trim(),profissionais:pessoas});
    b.fotosProfissionais=Object.fromEntries(Object.entries(b.fotosProfissionais||{}).filter(([nome])=>pessoas.includes(nome)));
    salvar(); telaPainel(); aviso('Personalização salva!');
  }
  // [TCC-C18] Cadastro de produto: valida preço e inclui na vitrine.
  if (form.id==='form-produto') {
    const b=loja(barbeariaPainel),preco=Number(document.querySelector('#novo-preco').value);
    if (preco<=0||!Number.isFinite(preco)) return;
    b.produtos.push({id:'p'+Date.now(),nome:document.querySelector('#novo-produto').value.trim(),preco:preco,emoji:'🧴'});
    salvar(); telaPainel(); aviso('Produto adicionado ao catálogo!');
  }
});
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-C19] INICIALIZAÇÃO — executa ao abrir o site              ║
// ╚══════════════════════════════════════════════════════════════╝
// hashchange atualiza a tela ao mudar #rota sem recarregar a página.
window.addEventListener('hashchange',renderizar);
prepararExemplosIniciais();
aplicarTema();
renderizar();

