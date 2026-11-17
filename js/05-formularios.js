// Envio dos formulários e início do site.

document.addEventListener('submit',e=>{
  const form=e.target;
  if (!['form-login','form-login-cliente','form-cadastro-cliente','form-cadastro-barbeiro',
      'form-agendar','form-avaliacao','form-compra','form-cadastro','form-aparencia','form-produto'].includes(form.id)) return;
  e.preventDefault();
  // guarda a sessão temporária com sessionStorage. NÃO é autenticação real.
  if (form.id==='form-login') {
    const usuario=document.querySelector('#login-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#login-senha').value;
    const conta=contaBarbeiro(usuario);
    if (!conta || conta.senha !== senha) {
      aviso('Usuário ou senha de demonstração incorretos.');
      return;
    }
    sessionStorage.setItem(CHAVE+'dono',conta.usuario);
    barbeariaPainel=(barbearias.find(b=>(b.dono||b.id)===conta.usuario)||{}).id||conta.usuario;
    abaPainel='visao';
    location.hash='#painel';
    renderizar();
    aviso('Bem-vindo ao painel de '+conta.nome+'!');
    return;
  }
  if (form.id==='form-login-cliente') {
    const usuario=document.querySelector('#cliente-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#cliente-senha').value;
    const conta=[...CONTAS_CLIENTE_DEMO,...contasClientes].find(c=>c.usuario===usuario && c.senha===senha);
    if(!conta) {aviso('Usuário ou senha de demonstração incorretos.');return;}
    sessionStorage.setItem(CHAVE+'cliente',conta.usuario);
    location.hash='#conta-cliente';renderizar();aviso('Login de cliente realizado!');
    return;
  }
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
  // Ao confirmar, verificamos a hora e guardamos o agendamento no navegador.
  if (form.id==='form-agendar') {
    const b=loja(location.hash.split('/')[1]);
    const servico=b.servicos[Number(document.querySelector('#servico').value)];
    const profissional=document.querySelector('#profissional').value;
    const data=document.querySelector('#dia').value;
    const hora=document.querySelector('#hora').value;
    if (!horariosLivres(b.id,data,profissional).includes(hora)) { aviso('Este horário não está mais disponível.'); atualizarHorarios(); return; }
    const cliente=document.querySelector('#nome-cliente').value.trim(), telefone=document.querySelector('#telefone-cliente').value.trim();
    if (!cliente||!telefone) return;
    const novoAgendamento = {
      id: Date.now(), idLoja: b.id, cliente: cliente,
      clienteUsuario: clienteLogado() || '', telefone: telefone,
      servico: servico.nome, profissional: profissional,
      data: data, hora: hora, preco: servico.preco, status: 'Confirmado'
    };
    agendamentos.push(novoAgendamento);
    if (!salvar()) {
      agendamentos.pop();
      return;
    }
    telaBarbearia(b.id);
    abrirModal(htmlTela("modal-agendamento-confirmado", [(cabecalhoModal('Agendamento registrado!')), (seguro(b.nome)), (dataBR(data)), (seguro(hora))]));
    aviso('Horário registrado com sucesso!');
  }
  if (form.id==='form-avaliacao') {
    const b=loja(form.dataset.id);
    const avaliacao = {
      nome: document.querySelector('#avaliador').value.trim(),
      estrelas: Number(document.querySelector('#estrelas').value),
      texto: document.querySelector('#comentario').value.trim()
    };
    b.avaliacoes.push(avaliacao);
    if (!salvar()) {
      b.avaliacoes.pop();
      return;
    }
    fecharModal();
    telaBarbearia(b.id);
    aviso('Avaliação publicada nesta demonstração.');
  }
  if (form.id==='form-compra') {
    const b=loja(form.dataset.id),p=b.produtos.find(x=>x.id===form.dataset.produto);
    const novoPedido = {
      id: Date.now(), idLoja: b.id, produto: p.nome, preco: p.preco,
      cliente: document.querySelector('#comprador').value.trim(),
      telefone: document.querySelector('#tel-comprador').value.trim()
    };
    pedidos.push(novoPedido);
    if (!salvar()) {
      pedidos.pop();
      return;
    }
    fecharModal();
    aviso('Pedido simulado registrado! Confira no painel.');
  }
  if (form.id==='form-cadastro') {
    const novo=criarExemplo('loja'+Date.now(),document.querySelector('#cad-nome').value.trim(),
        document.querySelector('#cad-bairro').value,4,0,0,document.querySelector('#cad-descricao').value.trim(),
        '#c99457',['Profissional 1'],false);
    novo.avaliacoes=[];novo.dono=donoLogado();
    barbearias.push(novo); barbeariaPainel=novo.id; abaPainel='aparencia';
    salvar(); fecharModal(); telaPainel(); aviso('Barbearia adicionada à vitrine!');
  }
  if (form.id==='form-aparencia') {
    const b=loja(barbeariaPainel);
    const pessoas=document.querySelector('#editar-profissionais').value.split(',').map(x=>x.trim()).filter(Boolean);
    if (!pessoas.length) { aviso('Informe pelo menos um profissional.'); return; }
    Object.assign(b,{nome:document.querySelector('#editar-nome').value.trim(),bairro:document.querySelector('#editar-bairro').value.trim(),
        cor:document.querySelector('#editar-cor').value,descricao:document.querySelector('#editar-descricao').value.trim(),
        horario:document.querySelector('#editar-horario').value.trim(),profissionais:pessoas});
    b.fotosProfissionais=Object.fromEntries(Object.entries(b.fotosProfissionais||{}).filter(([nome])=>pessoas.includes(nome)));
    salvar(); telaPainel(); aviso('Personalização salva!');
  }
  if (form.id==='form-produto') {
    const b=loja(barbeariaPainel),preco=Number(document.querySelector('#novo-preco').value);
    if (preco<=0||!Number.isFinite(preco)) return;
    b.produtos.push({id:'p'+Date.now(),nome:document.querySelector('#novo-produto').value.trim(),preco:preco,emoji:'🧴'});
    salvar(); telaPainel(); aviso('Produto adicionado ao catálogo!');
  }
});
// hashchange atualiza a tela ao mudar #rota sem recarregar a página.
// Ao mudar #inicio, #login, #painel, etc., atualiza a página.
window.addEventListener('hashchange', () => {
  if (modelosProntos) renderizar();
});

let modelosProntos = false;
prepararExemplosIniciais();
aplicarTema();

// Depois que o HTML de todas as telas foi carregado, o site inicia.
carregarModelosHTML()
  .then(() => {
    modelosProntos = true;
    renderizar();
  })
  .catch(erro => {
    console.error(erro);
    document.getElementById('app').innerHTML =
      '<div class="wrap page-content"><h2>Não foi possível abrir o site</h2>' +
      '<p>Abra pela Vercel ou use a extensão Live Server no VS Code.</p></div>';
  });
