/* MVC — VIEW (Visão): funções que mostram HTML e atualizam a tela.
   Exemplo: telaBarbearia() usa dados do Model para montar o perfil. */

function aplicarTema() {
  const escuro = localStorage.getItem(CHAVE+'tema')!=='claro';
  document.body.classList.toggle('theme-dark',escuro);
  document.querySelector('#theme-label').textContent=escuro?'Claro':'Escuro';
  document.querySelector('#theme-toggle').setAttribute('aria-label',escuro?'Ativar modo claro':'Ativar modo escuro');
}
function atualizarCabecalho() {
  const rota=decodeURIComponent(location.hash||'#inicio');
  const b=rota.startsWith('#barbearia/')?loja(rota.split('/')[1]):null;
  document.querySelector('#logo-home').hidden=!!b;
  document.querySelector('#nav-links').hidden=!!b;
  document.querySelector('#nav-admin').hidden=!!b;
  document.querySelector('#nav-client').hidden=!!b;
  const nome=document.querySelector('#shop-header-name');
  nome.hidden=!b;
  if (b) nome.innerHTML='<span>'+seguro(b.nome)+'</span><a class="logo-mark shop-home-mark" href="#inicio" title="Voltar ao BarberSync" aria-label="Voltar ao BarberSync">B<span>✦</span></a>';
  const admin=document.querySelector('#nav-admin');
  admin.textContent=donoLogado()?'Meu painel ↗':'Área do barbeiro ↗';
  admin.href=donoLogado()?'#painel':'#login';
  const cliente=document.querySelector('#nav-client');
  cliente.textContent=clienteLogado()?'Minha conta ↗':'Entrar como cliente';
  cliente.href=clienteLogado()?'#conta-cliente':'#login-cliente';
}
function abasAcesso(tipo) {
  return '<div class="auth-options">'+
    '<a href="#login-cliente" class="'+(tipo==='cliente'?'active':'')+'">Sou cliente</a>'+
    '<a href="#login" class="'+(tipo==='barbeiro'?'active':'')+'">Sou barbeiro</a></div>';
}
function telaLogin() {
  if (donoLogado()) { location.hash='#painel';return; }
  document.documentElement.style.setProperty('--accent','#d8aa56');
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">ÁREA DO PROPRIETÁRIO</span><h1>Gerencie sua barbearia.</h1><p>Agenda, avaliações, equipe e faturamento em um só painel.</p></div></section>'+
    '<section class="page-content"><div class="wrap login-layout"><div class="panel">'+abasAcesso('barbeiro')+
    '<h2>Entrar como barbeiro</h2><p class="muted small">Acesso demonstrativo, sem servidor.</p>'+
    '<form id="form-login">'+campo('Usuário','login-usuario','')+campo('Senha','login-senha','','password')+
    '<button type="submit" class="btn btn-primary btn-block">Acessar meu painel →</button></form>'+
    '<div class="auth-switch">Ainda não tem barbearia? <a href="#cadastro-barbeiro">Criar conta de barbeiro</a></div>'+
    '<div class="login-example"><strong>Para testar agora:</strong><p style="margin:5px 0">Usuário: <code>estacao47</code> | Senha: <code>demo123</code></p></div>'+
    '<p class="help">Este login é apenas uma simulação: não use senhas pessoais.</p></div></div></section>';
}
function telaLoginCliente() {
  if (clienteLogado()) { location.hash='#conta-cliente';return; }
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">ÁREA DO CLIENTE</span><h1>Seu estilo começa aqui.</h1><p>Entre para consultar seus horários e agilizar novos agendamentos.</p></div></section>'+
    '<section class="page-content"><div class="wrap login-layout"><div class="panel">'+abasAcesso('cliente')+
    '<h2>Entrar como cliente</h2><p class="muted small">Acesso demonstrativo para o TCC.</p>'+
    '<form id="form-login-cliente">'+campo('Usuário','cliente-usuario','')+campo('Senha','cliente-senha','','password')+
    '<button type="submit" class="btn btn-primary btn-block">Entrar como cliente →</button></form>'+
    '<div class="login-example"><strong>Teste rápido:</strong> cliente / demo123</div>'+
    '<div class="auth-switch">Primeira vez aqui? <a href="#cadastro-cliente">Criar conta de cliente</a></div>'+
    '<p class="help">Cadastre dados fictícios. As informações ficam somente neste navegador.</p></div></div></section>';
}
function telaCadastroCliente() {
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">NOVO CLIENTE</span><h1>Crie sua conta.</h1><p>Um cadastro simples para testar seus agendamentos no TCC.</p></div></section>'+
    '<section class="page-content"><div class="wrap login-layout"><div class="panel">'+abasAcesso('cliente')+
    '<h2>Cadastrar cliente</h2><form id="form-cadastro-cliente">'+
    campo('Nome para demonstração','cliente-nome','')+
    campo('Usuário (mín. 4 caracteres)','novo-cliente-usuario','')+
    campo('Senha demonstrativa (mín. 4 caracteres)','novo-cliente-senha','','password')+
    campo('Telefone fictício (opcional)','novo-cliente-telefone','','tel').replace(' required>','>')+
    '<label class="terms-consent"><input type="checkbox" required> Li e concordo com os <a href="#politicas">Termos e Políticas</a> do protótipo.</label>'+ 
    '<button type="submit" class="btn btn-primary btn-block">Criar conta de cliente →</button></form>'+
    '<div class="auth-switch">Já tem conta? <a href="#login-cliente">Fazer login</a></div>'+
    '<p class="help">Não existe cadastro real, servidor ou criptografia. Não forneça dados pessoais verdadeiros.</p></div></div></section>';
}
function telaCadastroBarbeiro() {
  const escolhido=(location.hash.split('/')[1]||'profissional').toLowerCase();
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">PARA BARBEIROS</span><h1>Cadastre seu negócio.</h1><p>Crie sua vitrine em Barueri e experimente o painel completo.</p></div></section>'+
    '<section class="page-content"><div class="wrap login-layout"><div class="panel">'+abasAcesso('barbeiro')+
    '<h2>Novo proprietário</h2><form id="form-cadastro-barbeiro">'+
    campo('Nome do responsável','dono-nome','')+
    campo('Usuário (mín. 4 caracteres)','dono-usuario','')+
    campo('Senha demonstrativa (mín. 4 caracteres)','dono-senha','','password')+
    campo('Nome da barbearia','dono-barbearia','')+
    '<div class="field"><label for="dono-bairro">Bairro em Barueri</label><select id="dono-bairro" required><option>Alphaville</option><option>Centro</option><option>Jardim Belval</option><option>Jardim Silveira</option><option>Parque Imperial</option></select></div>'+
    '<div class="field"><label for="dono-plano">Plano mensal ilustrativo</label><select id="dono-plano">'+
       PLANOS.map(p=>'<option value="'+p.id+'" '+(p.id===escolhido?'selected':'')+'>'+p.nome+' — '+dinheiro(p.preco)+'/mês</option>').join('')+
    '</select></div>'+
    '<p class="book-alert">Nenhum pagamento ou assinatura será efetuado. Os preços são apenas propostas para o TCC.</p>'+
    '<label class="terms-consent"><input type="checkbox" required> Li e concordo com os <a href="#politicas">Termos e Políticas</a> do protótipo.</label>'+ 
    '<button type="submit" class="btn btn-primary btn-block">Criar meu acesso e vitrine →</button></form>'+
    '<div class="auth-switch">Já tem cadastro? <a href="#login">Fazer login</a></div>'+
    '<p class="help">Senha demonstrativa armazenada localmente. Não use credenciais reais.</p></div></div></section>';
}
function telaContaCliente() {
  if (!clienteLogado()) { location.hash='#login-cliente';return; }
  const usuario=dadosCliente();
  const seus=agendamentos.filter(a=>a.clienteUsuario===clienteLogado());
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">MINHA CONTA</span><h1>Olá, '+seguro(usuario?.nome||'cliente')+'!</h1><p>Acompanhe seus agendamentos demonstrativos.</p></div></section>'+
    '<div class="wrap page-content"><div class="section-head"><div><h2>Meus horários</h2><p class="muted">Somente reservas vinculadas a esta conta local.</p></div><button class="btn btn-outline btn-sm" data-logout-cliente>Sair da conta</button></div>'+
    cardsAgendamentos(seus)+
    '<a href="#inicio" class="btn btn-primary">Agendar novo atendimento →</a></div>';
}
function telaPlanos() {
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">PARA BARBEARIAS DE BARUERI</span><h1>Seu negócio merece destaque.</h1><p>Planos mensais ilustrativos para demonstrar o modelo de receita do BarberSync.</p></div></section>'+
    '<section class="section"><div class="wrap"><div class="plans-grid">'+PLANOS.map((p,i)=>
      '<article class="plan-card '+(i===1?'featured':'')+'"><span class="eyebrow">'+(i===1?'✦ MAIS POPULAR':'BARBERSYNC')+'</span>'+
      '<h3>'+p.nome+'</h3><p class="muted">'+p.descricao+'</p>'+
      '<div class="plan-price">'+dinheiro(p.preco)+' <small>/mês</small></div>'+
      '<ul class="plan-features">'+p.recursos.map(t=>'<li>'+seguro(t)+'</li>').join('')+'</ul>'+
      '<a class="btn '+(i===1?'btn-primary':'btn-dark')+' btn-block" href="#cadastro-barbeiro/'+p.id+'">Selecionar plano →</a></article>'
    ).join('')+'</div>'+
    '<p class="demo-note" style="margin-top:24px">* Valores e funcionalidades propostos para o TCC, sem cobrança real, renovação automática ou diferenciação técnica de acesso entre planos.</p>'+
    '<p style="margin-top:12px"><a href="#politicas" class="btn btn-outline">Consultar políticas e termos ↗</a></p></div></section>';
}
function telaPoliticas() {
  app.innerHTML='<section class="page-intro"><div class="wrap"><span class="eyebrow">TRANSPARÊNCIA</span><h1>Políticas e termos.</h1><p>Modelo de política para a apresentação acadêmica do BarberSync.</p></div></section>'+
    '<section class="page-content"><div class="wrap policy-content">'+
    '<div class="owner-note">Este texto é uma proposta demonstrativa para o TCC, não uma política jurídica definitiva. Antes de operar comercialmente, seria necessário revisar com profissionais responsáveis.</div>'+
    '<div class="panel"><h2>1. Termos de uso</h2><p>O BarberSync é apresentado como uma plataforma de descoberta de barbearias em Barueri, com perfis de estabelecimentos, agendamentos, avaliações e produtos. Nesta versão, todas as ações são simuladas e não constituem reserva ou compra real.</p>'+
    '<h3>2. Privacidade e dados</h3><p>Os cadastros, avaliações, horários, fotos e pedidos de demonstração são armazenados no navegador por meio de localStorage e sessionStorage. Não existe servidor, banco de dados nem transmissão automática desses dados ao BarberSync. Evite inserir nomes, telefones, e-mails ou senhas reais nesta versão.</p>'+
    '<h3>3. Uso de fotos e avaliações</h3><p>O proprietário de um estabelecimento deverá ter permissão para publicar imagens do espaço, dos profissionais e dos produtos. Comentários devem respeitar as pessoas e não conter conteúdo ofensivo. As avaliações atualmente exibidas são ilustrativas ou adicionadas localmente.</p>'+
    '<h3>4. Agendamentos e cancelamentos</h3><p>O cliente poderá solicitar e cancelar reservas de demonstração ainda confirmadas. Reservas marcadas como concluídas não poderão ser canceladas pelo cliente nesta simulação. As regras comerciais, reagendamentos e possíveis taxas de cancelamento de uma futura plataforma deverão ser definidas com clareza.</p>'+
    '<h3>5. Produtos e pagamentos</h3><p>Pedidos de pomadas, óleos e outros produtos não geram cobrança nesta versão. A opção de marcar um pedido como entregue serve apenas para ilustrar um controle interno.</p>'+
    '<h3>6. Planos de assinatura</h3><p>As mensalidades exibidas na página de planos são valores hipotéticos do projeto. Não há checkout, cobrança, renovação automática, faturamento de assinatura nem contrato comercial ativo. Regras de cancelamento, reajustes e serviços oferecidos ainda serão definidas em versões futuras.</p>'+
    '<h3>7. Integrações futuras</h3><p>Integração com Google Maps, dados reais de estabelecimentos, autenticação segura e pagamentos ficam fora do escopo deste módulo do TCC.</p>'+
    '<h3>8. Dados e suporte</h3><p>O usuário pode restaurar os dados da demonstração no painel. A limpeza dos dados do site no navegador também apaga os registros locais. Uma versão comercial deverá informar canais de suporte, direitos dos titulares de dados e regras de retenção e exclusão.</p>'+
    '<p class="small">Documento ilustrativo • Versão acadêmica: novembro de 2026.</p></div>'+
    '<a class="btn btn-primary" href="#inicio">Voltar à vitrine</a></div></section>';
}

function aviso(mensagem) {
  const el = document.querySelector('#toast');
  el.textContent=mensagem;
  el.classList.add('visible');
  clearTimeout(avisoTimer);
  avisoTimer=setTimeout(()=>el.classList.remove('visible'),3500);
}
function abrirModal(html) {
  document.querySelector('#modal-root').innerHTML='<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true">'+html+'</div></div>';
}
function fecharModal() { document.querySelector('#modal-root').innerHTML=''; }
function cabecalhoModal(titulo) {
  return '<div class="modal-head"><h2>'+seguro(titulo)+'</h2><button class="icon-btn" type="button" data-fechar aria-label="Fechar">×</button></div>';
}
function campo(rotulo,id,valor,tipo) {
  return '<div class="field"><label for="'+id+'">'+rotulo+'</label><input id="'+id+'" name="'+id+'" type="'+(tipo||'text')+'" value="'+seguro(valor||'')+'" required></div>';
}
function botao(texto,classe) {
  return '<button class="btn '+(classe||'btn-primary')+'" type="submit">'+texto+'</button>';
}

// 3. Página inicial: busca, filtros e vitrine de barbearias.
function telaInicio() {
  document.documentElement.style.setProperty('--accent','#d8aa56');
  app.innerHTML =
    '<section class="hero"><div class="wrap hero-content">'+
      '<div class="eyebrow">✦ O melhor do seu bairro, em um lugar</div>'+
      '<h1>O próximo corte <em>perfeito</em> está mais perto do que você imagina.</h1>'+
      '<p class="subtitle">Descubra barbearias em Barueri, compare avaliações, conheça profissionais e agende seu horário em poucos cliques.</p>'+
      '<div class="hero-badges"><span><i class="dot"></i> Barbearias de Barueri</span><span><i class="dot"></i> Agendamento simples</span><span><i class="dot"></i> Você escolhe onde ir</span></div>'+
    '</div></section>'+
    '<div class="wrap search-wrap"><div class="search-panel">'+
      '<div class="field"><label for="busca">O que você procura?</label><input id="busca" placeholder="Nome da barbearia ou bairro" value="'+seguro(filtro.busca)+'"></div>'+
      '<div class="field"><label for="bairro">Região</label><select id="bairro"><option>Todos</option>'+[...new Set(barbearias.map(b=>b.bairro))].sort().map(b=>'<option '+(filtro.bairro===b?'selected':'')+'>'+seguro(b)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label for="ordenacao">Ordenar por</label><select id="ordenacao"><option value="nota">Mais bem avaliadas</option><option value="avaliacoes">Mais avaliações</option><option value="preco">Menor preço</option></select></div>'+
      '<button class="btn btn-dark filter-btn" id="limpar-filtros">Limpar filtros</button>'+
    '</div><p class="demo-note">ⓘ Barbearias, notas, comentários e fotos ilustrativos para apresentação do TCC. Não são dados obtidos do Google.</p></div>'+
    '<section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">ENCONTRE SEU ESTILO</span><h2>Explore as barbearias</h2><p class="muted">Uma vitrine para descobrir seu próximo lugar favorito.</p></div><span id="quantidade" class="tag">0 resultados</span></div>'+
    '<div class="category-row" id="categorias">'+['Todos','Corte','Barba','Produtos'].map(t=>'<button class="pill '+(filtro.tipo===t?'active':'')+'" data-tipo="'+t+'">'+t+'</button>').join('')+'</div>'+
    '<div id="cards" class="cards"></div></div></section>'+
    '<section class="section benefit-strip"><div class="wrap benefits">'+
      '<div class="benefit"><span class="benefit-icon">⌕</span><div><strong>Descubra com facilidade</strong><span>Compare estabelecimentos em uma só vitrine.</span></div></div>'+
      '<div class="benefit"><span class="benefit-icon">★</span><div><strong>Escolha com confiança</strong><span>Confira avaliações e fotos demonstrativas.</span></div></div>'+
      '<div class="benefit"><span class="benefit-icon">▣</span><div><strong>Reserve sem complicação</strong><span>Selecione data, profissional e serviço.</span></div></div>'+
    '</div></section>';
  document.querySelector('#ordenacao').value=filtro.ordenacao;
  atualizarCards();
}
function atualizarCards() {
  const busca=filtro.busca.trim().toLowerCase();
  const resultados=barbearias.filter(b=>
    (b.nome.toLowerCase().includes(busca)||b.bairro.toLowerCase().includes(busca)) &&
    (filtro.bairro==='Todos'||b.bairro===filtro.bairro) &&
    (filtro.tipo==='Todos'||(filtro.tipo==='Produtos'?b.produtos.length>0:b.servicos.some(s=>s.nome.toLowerCase().includes(filtro.tipo.toLowerCase()))))
  );
  resultados.sort((a,b)=>filtro.ordenacao==='preco'?menorPreco(a)-menorPreco(b):filtro.ordenacao==='avaliacoes'?totalAvaliacoes(b)-totalAvaliacoes(a):notaMedia(b)-notaMedia(a));
  document.querySelector('#quantidade').textContent=resultados.length+' barbearia(s)';
  document.querySelector('#cards').innerHTML=resultados.length ? resultados.map(b=>
    '<article class="shop-card" data-loja="'+seguro(b.id)+'" tabindex="0" role="link" aria-label="Abrir '+seguro(b.nome)+'">'+
      '<div class="card-image"><img src="'+seguro(b.fotos[0])+'" alt="Ambiente ilustrativo de barbearia" loading="lazy"><span class="image-label">'+seguro(b.bairro)+'</span></div>'+
      '<div class="card-body"><div class="card-top"><h3>'+seguro(b.nome)+'</h3><div class="rating">'+estrelas(b)+'</div></div>'+
      '<p class="card-desc">'+seguro(b.descricao)+'</p><div class="card-foot"><span>A partir de <strong>'+dinheiro(menorPreco(b))+'</strong></span><span class="strong">Ver barbearia ↗</span></div></div>'+
    '</article>'
  ).join('') : '<div class="empty">Nenhuma barbearia encontrada. Tente outro filtro.</div>';
}

// 4. Perfil individual, horários, serviços, produtos e avaliações.
function telaBarbearia(id) {
  const b=loja(id);
  if (!b) { location.hash='#inicio'; return; }
  document.documentElement.style.setProperty('--accent',/^#[0-9a-f]{6}$/i.test(b.cor)?b.cor:'#d8aa56');
  app.innerHTML=
    '<section class="detail-header cover-header"><img class="cover-background" src="'+seguro(b.capa||b.fotos[0])+'" alt="" aria-hidden="true"><div class="wrap">'+
      '<div class="breadcrumb"><a href="#inicio">Início</a> / Barbearias / '+seguro(b.nome)+'</div>'+
      '<div class="detail-title-row"><div><span class="eyebrow">✦ BARUERI • '+seguro(b.bairro.toUpperCase())+'</span><h1>'+seguro(b.nome)+'</h1><p>⌖ '+seguro(b.bairro)+', Barueri – SP</p></div>'+
      '<div class="rating">'+estrelas(b)+' <span class="small">• Avaliações de demonstração</span></div></div>'+
      (podeEditar(b)?'<p style="margin:18px 0 0"><button class="btn btn-primary btn-sm" data-editar-loja="'+seguro(b.id)+'">✎ Editar minha barbearia</button></p>':'')+
    '</div></section>'+
    '<div class="wrap detail-main"><div class="gallery">'+b.fotos.map((foto,i)=>'<img src="'+seguro(foto)+'" alt="Foto '+(i+1)+' da barbearia" loading="lazy">').join('')+'</div>'+
    '<div class="detail-grid"><div>'+
      '<section class="panel"><span class="eyebrow">SOBRE NÓS</span><h3>Conheça nosso espaço</h3><p>'+seguro(b.descricao)+'</p><p class="small">📍 '+seguro(b.bairro)+', Barueri – SP</p><p class="small">🕒 '+seguro(b.horario)+'</p></section>'+
      '<section class="panel"><span class="eyebrow">O QUE FAZEMOS</span><h3>Serviços e valores</h3>'+
        b.servicos.map(s=>'<div class="service-row"><div><strong>'+seguro(s.nome)+'</strong><span>⏱ '+seguro(s.duracao)+'</span></div><strong>'+dinheiro(s.preco)+'</strong></div>').join('')+
      '</section>'+
      '<section class="panel"><span class="eyebrow">NOSSA EQUIPE</span><h3>Profissionais</h3><div class="professional-grid">'+b.profissionais.map(p=>
        '<div class="pro-card">'+((b.fotosProfissionais||{})[p]?'<img src="'+seguro(b.fotosProfissionais[p])+'" alt="Foto de '+seguro(p)+'">':'<div class="pro-avatar">'+seguro(p.slice(0,1).toUpperCase())+'</div>')+
        '<strong>'+seguro(p)+'</strong><span>Barbeiro profissional</span></div>').join('')+'</div></section>'+
      '<section class="panel"><span class="eyebrow">O QUE OS CLIENTES DIZEM</span><h3>Avaliações <span class="rating">'+estrelas(b)+'</span></h3>'+
      '<p class="small">Comentários fictícios ou cadastrados localmente neste navegador.</p>'+
      [...b.avaliacoes].reverse().map(a=>'<div class="review"><div class="review-head"><strong>'+seguro(a.nome)+'</strong><span class="stars">'+('★'.repeat(Number(a.estrelas)))+'</span></div><p>'+seguro(a.texto)+'</p></div>').join('')+
      '<button class="btn btn-outline" data-avaliar="'+seguro(b.id)+'">☆ Escrever avaliação</button></section>'+
      (b.produtos.length ? '<section class="panel"><span class="eyebrow">PRODUTOS DISPONÍVEIS</span><h3>Leve seu estilo para casa</h3><div class="product-grid">'+
        b.produtos.map(p=>'<div class="product"><div class="product-thumb">'+(p.imagem?'<img src="'+seguro(p.imagem)+'" alt="Foto de '+seguro(p.nome)+'">':'<span aria-label="Sem foto cadastrada">'+seguro(p.emoji||'🧴')+'</span>')+'</div><strong>'+seguro(p.nome)+'</strong><small>Retirada na barbearia</small><div class="product-bottom"><b>'+dinheiro(p.preco)+'</b><button class="btn btn-sm btn-dark" data-comprar="'+seguro(b.id)+'" data-produto="'+seguro(p.id)+'">Pedir ↗</button></div></div>').join('')+
      '</div></section>' : '')+
    '</div><aside class="panel booking"><span class="eyebrow">RESERVE SEU HORÁRIO</span><h3>Agende seu próximo corte</h3><p class="small">Escolha o serviço e encontre um horário disponível.</p>'+
      '<form id="form-agendar">'+
      '<div class="field"><label for="servico">Serviço</label><select id="servico" required>'+b.servicos.map((s,i)=>'<option value="'+i+'">'+seguro(s.nome)+' — '+dinheiro(s.preco)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label for="profissional">Profissional</label><select id="profissional" required>'+b.profissionais.map(p=>'<option>'+seguro(p)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label for="dia">Data</label><input id="dia" type="date" min="'+hoje()+'" value="'+proximaDataDisponivel(b.id,b.profissionais[0])+'" required></div>'+
      '<div class="field"><label for="hora">Horário</label><select id="hora" required></select></div>'+
      '<div class="field"><label for="nome-cliente">Seu nome</label><input id="nome-cliente" maxlength="60" placeholder="Nome e sobrenome" value="'+seguro(nomeCliente())+'" required></div>'+
      '<div class="field"><label for="telefone-cliente">WhatsApp</label><input id="telefone-cliente" type="tel" maxlength="20" placeholder="(11) 99999-9999" value="'+seguro(telefoneCliente())+'" required></div>'+
      '<div class="price-preview" id="resumo-preco"></div><div id="aviso-horarios" class="help" aria-live="polite"></div><button id="confirmar-agendamento" type="submit" class="btn btn-primary btn-block">Confirmar agendamento →</button>'+
      '<p class="help">Agendamento de demonstração. Não envia mensagens nem reserva horário em outros dispositivos.</p></form></aside></div></div>';
  atualizarHorarios();
}

function atualizarHorarios() {
  const b=loja(location.hash.split('/')[1]);
  if (!b || !document.querySelector('#form-agendar')) return;
  const servico=b.servicos[Number(document.querySelector('#servico').value)];
  document.querySelector('#resumo-preco').textContent='Total do serviço: '+dinheiro(servico.preco);
  const horarios=horariosLivres(b.id,document.querySelector('#dia').value,document.querySelector('#profissional').value);
  document.querySelector('#hora').innerHTML=horarios.length ? horarios.map(h=>'<option>'+h+'</option>').join('') : '<option value="">Nenhum horário disponível</option>';
  document.querySelector('#confirmar-agendamento').disabled=!horarios.length;
  document.querySelector('#aviso-horarios').textContent=horarios.length?'Horários disponíveis para simulação. A reserva aparecerá na agenda do barbeiro.':'Sem horários nessa data. Escolha outra data ou profissional.';
}

// Exemplos fictícios evitam painel vazio na apresentação do TCC.

function telaPainel() {
  if (!donoLogado()) { telaLogin(); return; }
  const disponiveis=minhasLojas();
  if (!disponiveis.length) { sessionStorage.removeItem(CHAVE+'dono'); telaLogin();return; }
  const b=disponiveis.find(x=>x.id===barbeariaPainel)||disponiveis[0];
  barbeariaPainel=b.id;
  const agenda=agendamentos.filter(a=>a.idLoja===b.id);
  const vendas=pedidos.filter(p=>p.idLoja===b.id);
  const financeiro=resumoReceita(b,agenda,vendas);
  document.documentElement.style.setProperty('--accent','#d8aa56');
  const abas=[['visao','▦ Visão geral'],['agenda','▤ Agenda'],['faturamento','▥ Faturamento'],['avaliacoes','☆ Avaliações'],['pedidos','▣ Pedidos'],['aparencia','◐ Informações e cores'],['fotos','▧ Fotos e equipe'],['catalogo','◈ Produtos']];
  app.innerHTML=
    '<section class="page-intro"><div class="wrap"><div class="eyebrow">GESTÃO DA BARBEARIA</div><h1>Painel do barbeiro</h1><p>Personalize sua vitrine, gerencie a agenda e acompanhe os resultados.</p></div></section>'+
    '<div class="wrap page-content"><div class="owner-note">⚠ Login de demonstração, sem autenticação real ou banco de dados. Dados e imagens ficam neste navegador. Use somente informações fictícias. Plano selecionado: <strong>'+seguro((PLANOS.find(p=>p.id===b.plano)||PLANOS[1]).nome)+'</strong> (sem cobrança).</div>'+
    '<div class="dashboard"><aside class="sidebar"><small>Minha barbearia</small>'+
      abas.map(a=>'<button class="side-btn '+(abaPainel===a[0]?'active':'')+'" data-aba="'+a[0]+'">'+a[1]+'</button>').join('')+
    '</aside><div class="owner-main"><div class="owner-top"><div><div class="eyebrow">PAINEL DO PARCEIRO</div><h2>'+seguro(b.nome)+'</h2></div>'+
      '<div class="owner-toolbar"><select id="selecionar-loja" aria-label="Selecionar minha barbearia">'+disponiveis.map(x=>'<option value="'+seguro(x.id)+'" '+(x.id===b.id?'selected':'')+'>'+seguro(x.nome)+'</option>').join('')+'</select>'+
      '<button class="btn btn-dark btn-sm" data-cadastrar>+ Nova barbearia</button><button class="btn btn-outline btn-sm" data-logout>Sair</button></div></div>'+
    conteudoPainel(b,agenda,vendas,financeiro)+
    '</div></div><div style="margin-top:28px"><button class="btn btn-outline btn-sm" data-reset>↺ Restaurar dados da demonstração</button></div></div>';
}
function tabelaAgenda(agenda) {
  if (!agenda.length) return '<div class="showcase-empty"><p>Nenhum agendamento ainda. Faça uma reserva na vitrine ou insira dados fictícios para o TCC.</p><button class="btn btn-primary btn-sm" data-exemplos>Inserir agendamentos de demonstração</button></div>';
  return '<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Data / Hora</th><th>Status</th><th>Ação</th></tr></thead><tbody>'+
    [...agenda].sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora)).map(a=>
      '<tr><td><strong>'+seguro(a.cliente)+'</strong> '+(a.exemplo?'<span class="tag">EXEMPLO</span>':'')+'<span class="muted small">'+seguro(a.telefone)+'</span></td><td>'+seguro(a.servico)+'</td><td>'+seguro(a.profissional)+'</td><td>'+dataBR(a.data)+' '+seguro(a.hora)+'</td><td><span class="order-label">'+seguro(a.status)+'</span></td>'+
      '<td>'+(a.status==='Confirmado'?'<button class="btn btn-primary btn-sm" data-concluir="'+seguro(a.id)+'">Concluir</button>':'—')+'</td></tr>'
    ).join('')+'</tbody></table></div>';
}
function conteudoPainel(b,agenda,vendas,financeiro) {
  if (abaPainel==='visao') return     '<div class="stats"><div class="stat"><small>Agendamentos ativos</small><strong>'+agenda.filter(a=>a.status==='Confirmado').length+'</strong><span>Aguardando atendimento</span></div>'+
    '<div class="stat"><small>Serviços concluídos</small><strong>'+dinheiro(financeiro.servicos)+'</strong><span>Valor simulado</span></div>'+
    '<div class="stat"><small>Produtos entregues</small><strong>'+dinheiro(financeiro.produtos)+'</strong><span>Pedidos concluídos</span></div>'+
    '<div class="stat"><small>Faturamento total</small><strong>'+dinheiro(financeiro.total)+'</strong><span>Demonstrativo, não real</span></div></div>'+
    '<div class="panel"><div class="section-head"><h3>Próximos agendamentos</h3><button class="btn btn-outline btn-sm" data-aba="agenda">Ver agenda</button></div>'+tabelaAgenda(agenda.filter(a=>a.status==='Confirmado' && a.data>=hoje()))+'</div>'+
    '<div class="panel"><div class="section-head"><h3>Por profissional</h3><button class="btn btn-outline btn-sm" data-aba="faturamento">Ver detalhes</button></div>'+
    tabelaFaturamento(financeiro.profissionais)+
    '<p class="small muted">Somente atendimentos marcados como concluídos entram no total de cada barbeiro.</p></div>'+
    '<div class="panel"><h3>Avaliações em resumo</h3>'+painelAvaliacoes(b)+'<button class="btn btn-outline btn-sm" data-aba="avaliacoes">Ver comentários</button></div>'+ 
    '<div class="panel"><h3>Minha vitrine</h3><p>Veja sua barbearia como o cliente vê ou edite as fotos e informações.</p>'+
    '<a class="btn btn-outline" href="#barbearia/'+seguro(b.id)+'">Abrir minha barbearia ↗</a> '+
    '<button class="btn btn-primary" data-aba="fotos">Gerenciar fotos</button></div>';
  if (abaPainel==='agenda') return     '<div class="panel"><h3>Agenda de clientes</h3><p>Ao concluir um atendimento, o valor entra no faturamento demonstrativo do profissional e da barbearia.</p>'+tabelaAgenda(agenda)+'</div>';
  if (abaPainel==='faturamento') return     '<div class="stats"><div class="stat"><small>Serviços concluídos</small><strong>'+dinheiro(financeiro.servicos)+'</strong></div>'+
    '<div class="stat"><small>Produtos entregues</small><strong>'+dinheiro(financeiro.produtos)+'</strong></div>'+
    '<div class="stat"><small>Faturamento total da barbearia</small><strong>'+dinheiro(financeiro.total)+'</strong></div></div>'+
    '<div class="panel"><h3>Faturamento de cada barbeiro</h3><p>Exemplo: Lucas conclui um corte de R$ 45 e o total é atualizado. Reservas pendentes não são faturamento.</p><button type="button" class="btn btn-outline btn-sm" data-aba="agenda">Abrir agenda para concluir atendimentos →</button>'+
    tabelaFaturamento(financeiro.profissionais)+
    '<p class="revenue-info">O total individual considera apenas serviços concluídos. A barbearia soma os serviços concluídos e os produtos marcados como entregues. Todos os valores são fictícios.</p></div>';
  if (abaPainel==='avaliacoes') return '<div class="panel"><h3>Visão geral das avaliações</h3>'+painelAvaliacoes(b)+'<h3>Comentários de '+seguro(b.nome)+'</h3>'+
    [...b.avaliacoes].reverse().map(a=>'<div class="review"><div class="review-head"><strong>'+seguro(a.nome)+'</strong><span class="stars">'+('★'.repeat(Number(a.estrelas)))+'</span></div><p>'+seguro(a.texto)+'</p></div>').join('')+'</div>';
  if (abaPainel==='pedidos') return '<div class="panel"><h3>Pedidos de produtos</h3><p>Marque um pedido como entregue para incluí-lo no faturamento fictício da barbearia. Não há pagamento real.</p>'+
    (vendas.length ? '<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead><tbody>'+
     [...vendas].reverse().map(p=>'<tr><td>'+seguro(p.cliente)+'</td><td>'+seguro(p.produto)+'</td><td>'+dinheiro(p.preco)+'</td><td><span class="order-label">'+seguro(p.status||'Aguardando retirada')+'</span></td>'+
     '<td>'+(p.status==='Entregue'?'—':'<button class="btn btn-primary btn-sm" data-entregar="'+seguro(p.id)+'">Entregue</button>')+'</td></tr>').join('')+
     '</tbody></table></div>' : '<p class="muted">Nenhum pedido por enquanto.</p>')+'</div>';
  if (abaPainel==='aparencia') return '<div class="panel"><h3>Informações e identidade visual</h3><p>Edite o nome, cor principal, descrição, funcionamento e integrantes da sua equipe.</p>'+
    '<form id="form-aparencia" class="form-grid">'+
      '<div class="full">'+campo('Nome da barbearia','editar-nome',b.nome)+'</div>'+
      '<div class="field"><label for="editar-bairro">Bairro</label><input id="editar-bairro" value="'+seguro(b.bairro)+'" required></div>'+
      '<div class="field"><label for="editar-cor">Cor principal da página</label><input id="editar-cor" type="color" value="'+seguro(b.cor)+'"></div>'+
      '<div class="field full"><label for="editar-descricao">Descrição</label><textarea id="editar-descricao" required>'+seguro(b.descricao)+'</textarea></div>'+
      '<div class="field full"><label for="editar-horario">Horário de funcionamento (texto para o cliente)</label><input id="editar-horario" value="'+seguro(b.horario)+'" required></div>'+
      '<div class="field full"><label for="editar-profissionais">Profissionais (separados por vírgula)</label><input id="editar-profissionais" value="'+seguro(b.profissionais.join(', '))+'" required></div>'+
      '<p class="help full">A agenda demonstrativa usa horários fixos. Para mudar fotos dos profissionais, abra a aba Fotos e equipe.</p>'+
      '<div class="full"><div class="color-preview" style="border-left:9px solid '+seguro(b.cor)+'"><strong>'+seguro(b.nome)+'</strong><br><span class="small">Prévia simples da sua marca</span></div></div>'+
      '<div class="full">'+botao('Salvar alterações')+'</div></form></div>';
  if (abaPainel==='fotos') return     '<div class="panel"><h3>Capa da barbearia</h3><p>Esta imagem aparece ao fundo quando o cliente abre sua barbearia.</p>'+
    '<img class="cover-preview" src="'+seguro(b.capa||b.fotos[0])+'" alt="Imagem de capa atual">'+
    '<label class="upload-label" for="upload-capa">Alterar imagem de capa<input id="upload-capa" type="file" accept="image/*"></label>'+
    '<p class="upload-tip">Selecione uma foto JPG, PNG ou WebP, até 6 MB. O sistema reduz a foto para guardar no navegador.</p></div>'+
    '<div class="panel"><h3>Fotos da galeria</h3><p>Essas imagens aparecem no perfil e na vitrine. Máximo de 6 fotos.</p>'+
    '<div class="image-manager">'+b.fotos.map((foto,i)=>'<div class="image-tile"><img src="'+seguro(foto)+'" alt="Foto '+(i+1)+'"><button class="btn btn-outline btn-sm" data-remover-galeria="'+i+'" '+(b.fotos.length===1?'disabled':'')+'>Excluir</button></div>').join('')+'</div>'+
    '<label class="upload-label" for="upload-galeria">+ Adicionar fotos da barbearia<input id="upload-galeria" type="file" accept="image/*" multiple></label>'+
    '<p class="upload-tip">As fotos são armazenadas apenas neste dispositivo e podem ocupar o espaço local do navegador.</p></div>'+
    '<div class="panel"><h3>Fotos dos profissionais</h3><p>Escolha uma foto para cada barbeiro da sua equipe.</p>'+
    b.profissionais.map(p=>'<div class="photo-profile">'+
      ((b.fotosProfissionais||{})[p]?'<img src="'+seguro(b.fotosProfissionais[p])+'" alt="Foto de '+seguro(p)+'">':'<div class="pro-avatar">'+seguro(p.slice(0,1).toUpperCase())+'</div>')+
      '<div><strong>'+seguro(p)+'</strong><label>Escolher foto<input type="file" accept="image/*" data-upload-prof="'+seguro(p)+'"></label>'+
      ((b.fotosProfissionais||{})[p]?'<button class="btn btn-outline btn-sm" data-remover-foto-prof="'+seguro(p)+'">Remover foto</button>':'')+'</div></div>').join('')+'</div>';
  if (abaPainel==='catalogo') return '<div class="panel"><h3>Cadastrar produto</h3><p>Adicione pomadas, óleos ou outros itens para aparecerem na vitrine.</p>'+
    '<form id="form-produto" class="form-grid"><div class="field"><label for="novo-produto">Nome do produto</label><input id="novo-produto" maxlength="60" required></div>'+
    '<div class="field"><label for="novo-preco">Preço (R$)</label><input id="novo-preco" type="number" min="1" step="0.01" required></div>'+
    '<div class="full">'+botao('+ Adicionar produto')+'</div></form></div>'+
    '<div class="panel"><h3>Fotos e produtos cadastrados</h3><p>Use o campo de cada produto para adicionar uma foto JPG, PNG ou WebP. Ela aparecerá para os clientes.</p>'+
      (b.produtos.length?b.produtos.map(p=>
        '<div class="product-manager-row">'+
        (p.imagem?'<img class="product-photo-small" src="'+seguro(p.imagem)+'" alt="Foto de '+seguro(p.nome)+'">':'<div class="product-thumb product-photo-small">'+seguro(p.emoji||'🧴')+'</div>')+
        '<div><strong>'+seguro(p.nome)+'</strong><span class="small muted">'+dinheiro(p.preco)+'</span>'+
        '<label>Adicionar ou trocar foto<input type="file" accept="image/jpeg,image/png,image/webp" data-upload-prod="'+seguro(p.id)+'"></label></div>'+
        '<button class="btn btn-outline btn-sm" data-remover-produto="'+seguro(p.id)+'">Excluir</button></div>'
      ).join(''):'<p class="muted">Nenhum produto cadastrado.</p>')+'</div>';
  return '';
}
function painelAvaliacoes(b) {
  const lista=b.avaliacoes||[],total=lista.length;
  const media=total?lista.reduce((s,a)=>s+Number(a.estrelas),0)/total:0;
  const linhas=[5,4,3,2,1].map(n=>{
    const q=lista.filter(a=>Number(a.estrelas)===n).length;
    const largura=total?Math.round(q*100/total):0;
    return '<div class="rating-line"><span>'+n+' ★</span><span class="rating-bar"><i style="width:'+largura+'%"></i></span><strong>'+q+'</strong></div>';
  }).join('');
  return '<div class="rating-overview"><div class="rating-big"><strong>'+media.toFixed(1)+'</strong><span class="stars">★★★★★</span><p class="small">Média de '+total+' comentário(s) cadastrados</p></div><div>'+linhas+'</div></div>'+
    '<p class="help">Os números acima resumem os comentários disponíveis na demonstração. A nota histórica ilustrativa da vitrine é '+notaMedia(b).toFixed(1)+'. Não são dados reais do Google.</p>';
}
function tabelaFaturamento(profissionais) {
  return '<div class="table-wrap"><table class="revenue-table"><thead><tr><th>Barbeiro</th><th>Atendimentos concluídos</th><th>Faturamento demonstrativo</th></tr></thead><tbody>'+
    profissionais.map(p=>'<tr><td>'+seguro(p.nome)+'</td><td>'+p.atendimentos+'</td><td>'+dinheiro(p.total)+'</td></tr>').join('')+
    '</tbody></table></div>';
}

// 6. Histórico local, cadastro, avaliações e checkout fictício.
function cardsAgendamentos(lista) {
  if (!lista.length) return '<div class="empty"><h3>Nenhuma reserva registrada</h3><p>Escolha uma barbearia e faça seu primeiro agendamento de demonstração.</p><a class="btn btn-primary" href="#inicio">Explorar barbearias →</a></div>';
  return [...lista].reverse().map(a=>
    '<div class="account-card"><span class="eyebrow">'+seguro(a.status)+'</span><h3>'+seguro((loja(a.idLoja)||{}).nome||'Barbearia')+'</h3>'+
    '<p>'+seguro(a.servico)+' • '+seguro(a.profissional)+' • '+dataBR(a.data)+' às '+seguro(a.hora)+'</p>'+
    '<div class="list-row"><strong>'+dinheiro(a.preco)+'</strong>'+
    (a.status==='Confirmado'?'<button class="btn btn-outline btn-sm" data-cancelar="'+a.id+'">Cancelar agendamento</button>':'<span class="muted small">'+(a.status==='Concluído'?'Atendimento realizado':'Cancelado')+'</span>')+'</div></div>'
  ).join('');
}
function telaMeusAgendamentos() {
  document.documentElement.style.setProperty('--accent','#d8aa56');
  const logado=!!clienteLogado();
  const seus=agendamentos.filter(a=>logado?a.clienteUsuario===clienteLogado():!a.clienteUsuario&&!a.exemplo);
  app.innerHTML='<section class="page-intro"><div class="wrap"><div class="eyebrow">SEUS HORÁRIOS</div><h1>Meus agendamentos</h1><p>Reservas criadas neste navegador para a apresentação do TCC.</p></div></section>'+
    '<div class="wrap page-content"><div class="book-alert">'+(logado?'Mostrando reservas vinculadas à sua conta de demonstração.':'Você está como visitante. <a href="#login-cliente">Entre como cliente</a> para vincular novos agendamentos à sua conta.')+'</div>'+
    cardsAgendamentos(seus)+'</div>';
}
function modalAvaliacao(id) {
  abrirModal(cabecalhoModal('Avaliar barbearia')+
    '<p class="muted small">Avaliação de demonstração, sem publicação no Google.</p>'+
    '<form id="form-avaliacao" data-id="'+seguro(id)+'">'+
      campo('Seu nome','avaliador','')+
      '<div class="field"><label for="estrelas">Sua nota</label><select id="estrelas"><option value="5">★★★★★ — Excelente</option><option value="4">★★★★ — Muito bom</option><option value="3">★★★ — Bom</option><option value="2">★★ — Regular</option><option value="1">★ — Ruim</option></select></div>'+
      '<div class="field"><label for="comentario">Conte sua experiência</label><textarea id="comentario" maxlength="350" required></textarea></div>'+
      botao('Publicar avaliação')+'</form>');
}
function modalCompra(idLoja,idProduto) {
  const b=loja(idLoja);
  const p=b && b.produtos.find(x=>x.id===idProduto);
  if (!p) return;
  abrirModal(cabecalhoModal('Finalizar pedido')+
    '<p><strong>'+seguro(p.nome)+'</strong> • '+dinheiro(p.preco)+'</p>'+
    '<p class="muted small">Pedido fictício para retirada na barbearia. Não existe pagamento on-line.</p>'+
    '<form id="form-compra" data-id="'+seguro(idLoja)+'" data-produto="'+seguro(idProduto)+'">'+
      campo('Seu nome','comprador','')+campo('Telefone','tel-comprador','','tel')+
      '<div class="price-preview">Total: '+dinheiro(p.preco)+'</div>'+botao('Confirmar pedido de demonstração')+'</form>');
}
function modalCadastro() {
  abrirModal(cabecalhoModal('Cadastrar nova barbearia')+
    '<p class="muted small">A nova barbearia ficará vinculada a este usuário de demonstração e aparecerá na vitrine.</p>'+
    '<form id="form-cadastro">'+campo('Nome da barbearia','cad-nome','')+
      '<div class="field"><label for="cad-bairro">Bairro em Barueri</label><select id="cad-bairro"><option>Alphaville</option><option>Centro</option><option>Jardim Belval</option><option>Jardim Silveira</option><option>Parque Imperial</option><option>Outro bairro</option></select></div>'+
      '<div class="field"><label for="cad-descricao">Descrição</label><textarea id="cad-descricao" maxlength="250" required></textarea></div>'+botao('Criar barbearia')+'</form>');
}
// Reduz as fotos no próprio navegador (sem upload, servidor ou API).

