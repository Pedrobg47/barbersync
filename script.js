/* BARBERSYNC — protótipo TCC. Sem bibliotecas, servidor ou banco de dados. */

// 1. Dados fictícios usados para demonstrar as telas.
const FOTOS = [
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1100&q=85',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1100&q=85',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1100&q=85',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1100&q=85',
  'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=1100&q=85',
  'https://images.unsplash.com/photo-1598524374912-6b0b0badb41d?w=1100&q=85'
];
const SERVICOS = [
  { id:'corte', nome:'Corte masculino', preco:45, duracao:'40 min' },
  { id:'barba', nome:'Barba completa', preco:30, duracao:'30 min' },
  { id:'combo', nome:'Corte + barba', preco:65, duracao:'60 min' }
];
const PRODUTOS = [
  { id:'pomada', nome:'Pomada modeladora', preco:35, emoji:'🧴', imagem:'' },
  { id:'oleo', nome:'Óleo para barba', preco:29, emoji:'🪒', imagem:'' }
];
function criarExemplo(id, nome, bairro, foto, nota, quantidade, descricao, cor, profissionais, temProdutos) {
  return {
    id:id, dono:id, nome:nome, bairro:bairro, foto:foto, capa:FOTOS[(foto+3)%6], fotos:[FOTOS[foto],FOTOS[(foto+1)%6],FOTOS[(foto+2)%6]], fotosProfissionais:{},
    nota:nota, quantidade:quantidade, descricao:descricao, cor:cor,
    horario:'Segunda a sexta: 09h às 19h | Sábado: 09h às 17h | Domingo: fechado',
    profissionais:profissionais, servicos:SERVICOS.map(s=>({...s})),
    produtos:temProdutos ? PRODUTOS.map(p=>({...p})) : [],
    avaliacoes:[
      {nome:'Gabriel M.', estrelas:5, texto:'Atendimento excelente e ambiente muito agradável.'},
      {nome:'Rafael S.', estrelas:5, texto:'Ótimo serviço, equipe atenciosa. Recomendo!'}
    ]
  };
}
const EXEMPLOS = [
  criarExemplo('estacao47','Estação 47 Barber','Alphaville',0,4.9,128,'Um espaço moderno para cuidar do seu visual, com atendimento personalizado e clima descontraído.','#d8aa56',['Lucas','André','Bruno'],true),
  criarExemplo('nobre','Nobre Barbearia','Centro',1,4.8,94,'Cortes clássicos, tendências atuais e atenção a cada detalhe.','#c39651',['Gustavo','Matheus'],true),
  criarExemplo('distrito','Distrito do Corte','Jardim Belval',2,4.7,76,'Tradição de barbearia combinada com técnicas e estilos atuais.','#c6a160',['Pedro','Diego'],false),
  criarExemplo('vertice','Vértice Barber','Jardim Silveira',3,4.9,61,'Ambiente acolhedor, cortes precisos e uma experiência feita para você.','#e3b864',['Caio','Renato'],true)
];

// 2. LocalStorage guarda dados APENAS neste navegador.
const CHAVE = 'barbersync_tcc_';
function carregar(nome, padrao) {
  try { return JSON.parse(localStorage.getItem(CHAVE+nome)) || padrao; }
  catch (erro) { return padrao; }
}
let barbearias = carregar('barbearias', JSON.parse(JSON.stringify(EXEMPLOS)));
let agendamentos = carregar('agendamentos', []);
let pedidos = carregar('pedidos', []);
let contasBarbeiros = carregar('contasBarbeiros', []);
let contasClientes = carregar('contasClientes', []);
function salvar() {
  try {
    localStorage.setItem(CHAVE+'barbearias', JSON.stringify(barbearias));
    localStorage.setItem(CHAVE+'agendamentos', JSON.stringify(agendamentos));
    localStorage.setItem(CHAVE+'pedidos', JSON.stringify(pedidos));
    localStorage.setItem(CHAVE+'contasBarbeiros', JSON.stringify(contasBarbeiros));
    localStorage.setItem(CHAVE+'contasClientes', JSON.stringify(contasClientes));
    return true;
  } catch (erro) {
    aviso('Espaço do navegador cheio. Remova algumas imagens e tente novamente.');
    return false;
  }
}

// Login fictício do TCC. As senhas são públicas no JavaScript: NÃO é autenticação real.
// Cada usuário visualiza somente sua barbearia na interface de demonstração.
const CONTAS_DEMO = [
  {usuario:'estacao47', senha:'demo123', nome:'Estação 47 Barber'},
  {usuario:'nobre', senha:'demo123', nome:'Nobre Barbearia'},
  {usuario:'distrito', senha:'demo123', nome:'Distrito do Corte'},
  {usuario:'vertice', senha:'demo123', nome:'Vértice Barber'}
];
const donoLogado = () => sessionStorage.getItem(CHAVE+'dono') || '';
const clienteLogado = () => sessionStorage.getItem(CHAVE+'cliente') || '';
const CONTAS_CLIENTE_DEMO = [{usuario:'cliente',senha:'demo123',nome:'Cliente TCC',telefone:'(11) 90000-0000'}];
const dadosCliente = () => [...CONTAS_CLIENTE_DEMO,...contasClientes].find(c=>c.usuario===clienteLogado());
const contaBarbeiro = usuario => [...CONTAS_DEMO,...contasBarbeiros].find(c=>c.usuario===usuario);
const nomeCliente = () => (dadosCliente()||{}).nome || '';
const telefoneCliente = () => (dadosCliente()||{}).telefone || '';
const PLANOS = [
  {id:'essencial',nome:'Essencial',preco:39.90,descricao:'Para começar sua presença digital.',recursos:['Vitrine com fotos e avaliações','Agendamento demonstrativo','Cadastro de serviços e equipe']},
  {id:'profissional',nome:'Profissional',preco:79.90,descricao:'Para organizar a rotina da barbearia.',recursos:['Tudo do plano Essencial','Painel de agenda e faturamento','Fotos de profissionais e produtos','Visão geral das avaliações']},
  {id:'premium',nome:'Premium',preco:129.90,descricao:'Uma experiência completa para seu negócio.',recursos:['Tudo do plano Profissional','Destaque visual na vitrine','Personalização ampliada','Suporte prioritário (proposta futura)']}
];
const minhasLojas = () => barbearias.filter(b=>(b.dono || b.id)===donoLogado());
const podeEditar = b => !!b && !!donoLogado() && (b.dono || b.id)===donoLogado();

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

const dinheiro = valor => Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const seguro = texto => String(texto == null ? '' : texto).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const loja = id => barbearias.find(b=>b.id===id);
const hoje = () => {
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
};
const dataBR = d => d ? d.split('-').reverse().join('/') : '—';
const notaMedia = b => {
  const novas = b.avaliacoes.length-2;
  if (!b.quantidade) return b.avaliacoes.length ? b.avaliacoes.reduce((s,a)=>s+a.estrelas,0)/b.avaliacoes.length : 0;
  const extras = b.avaliacoes.slice(Math.max(0,b.avaliacoes.length-novas));
  return (b.nota*b.quantidade+extras.reduce((s,a)=>s+a.estrelas,0))/(b.quantidade+extras.length);
};
const totalAvaliacoes = b => b.quantidade ? b.quantidade+Math.max(0,b.avaliacoes.length-2) : b.avaliacoes.length;
const estrelas = b => totalAvaliacoes(b) ? '<span class="stars">★</span> '+notaMedia(b).toFixed(1)+' <span class="muted">('+totalAvaliacoes(b)+')</span>' : '<span class="muted">Novo</span>';
const menorPreco = b => b.servicos.length ? Math.min(...b.servicos.map(s=>s.preco)) : 0;
const app = document.querySelector('#app');
let filtro = {busca:'',bairro:'Todos',ordenacao:'nota',tipo:'Todos'};
let barbeariaPainel = barbearias[0].id;
let abaPainel = 'visao';
let avisoTimer;

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
function proximaDataDisponivel(id,profissional) {
  for(let i=0;i<15;i++) {
    const d=new Date();d.setDate(d.getDate()+i);
    const data=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    if (horariosLivres(id,data,profissional).length) return data;
  }
  return hoje();
}
function horariosLivres(id,data,profissional) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data||'') || data<hoje()) return [];
  const dia=new Date(data+'T12:00:00').getDay();
  if (dia===0) return [];
  const fim=dia===6?17:19;
  const horarios=[];
  for (let hora=9;hora<fim;hora++) {
    const h=String(hora).padStart(2,'0')+':00';
    if (data===hoje() && h<=new Date().toTimeString().slice(0,5)) continue;
    if (!agendamentos.some(a=>a.idLoja===id && a.data===data && a.hora===h && a.profissional===profissional && a.status!=='Cancelado')) horarios.push(h);
  }
  return horarios;
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
function dataRelativa(dias) {
  const d=new Date();d.setDate(d.getDate()+dias);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function inserirExemplosLoja(b) {
  if (agendamentos.some(a=>a.idLoja===b.id)) return false;
  const pro1=b.profissionais[0]||'Profissional 1';
  const pro2=b.profissionais[1]||pro1;
  const corte=b.servicos[0]||SERVICOS[0],combo=b.servicos[2]||corte;
  const dataAgendada=proximaDataDisponivel(b.id,pro1);
  const horarios=horariosLivres(b.id,dataAgendada,pro1);
  const codigo=Date.now()+Math.floor(Math.random()*10000);
  agendamentos.push(
    {id:codigo,idLoja:b.id,cliente:'Cliente Exemplo A',telefone:'(11) 90000-0000',servico:corte.nome,profissional:pro1,data:dataRelativa(-2),hora:'10:00',preco:corte.preco,status:'Concluído',exemplo:true},
    {id:codigo+1,idLoja:b.id,cliente:'Cliente Exemplo B',telefone:'(11) 90000-0000',servico:combo.nome,profissional:pro2,data:dataRelativa(-1),hora:'14:00',preco:combo.preco,status:'Concluído',exemplo:true},
    {id:codigo+2,idLoja:b.id,cliente:'Cliente Exemplo C',telefone:'(11) 90000-0000',servico:corte.nome,profissional:pro1,data:dataAgendada,hora:horarios[0]||'10:00',preco:corte.preco,status:'Confirmado',exemplo:true}
  );
  if(b.produtos.length) pedidos.push({id:codigo+3,idLoja:b.id,cliente:'Cliente Exemplo D',produto:b.produtos[0].nome,preco:b.produtos[0].preco,status:'Entregue',exemplo:true});
  return true;
}
function prepararExemplosIniciais() {
  if(localStorage.getItem(CHAVE+'dadosDemonstracaoV3')) return;
  if(!agendamentos.length && !pedidos.length) {
    barbearias.filter(b=>['estacao47','nobre','distrito','vertice'].includes(b.id)).forEach(inserirExemplosLoja);
    salvar();
  }
  localStorage.setItem(CHAVE+'dadosDemonstracaoV3','1');
}

// 5. Área do dono: agenda, avaliações, pedidos e personalização.
function resumoReceita(b, agenda, vendas) {
  // Faturamento demonstrativo: apenas serviços concluídos e pedidos entregues.
  const concluidos=agenda.filter(a=>a.status==='Concluído');
  const entregues=vendas.filter(p=>p.status==='Entregue');
  const servicos=concluidos.reduce((s,a)=>s+Number(a.preco||0),0);
  const produtos=entregues.reduce((s,p)=>s+Number(p.preco||0),0);
  const nomes=[...new Set([...b.profissionais,...concluidos.map(a=>a.profissional)])];
  const profissionais=nomes.map(nome=>{
    const feitos=concluidos.filter(a=>a.profissional===nome);
    return {nome:nome,atendimentos:feitos.length,total:feitos.reduce((s,a)=>s+Number(a.preco||0),0)};
  });
  return {servicos:servicos,produtos:produtos,total:servicos+produtos,profissionais:profissionais};
}
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
  if (abaPainel==='visao') return
    '<div class="stats"><div class="stat"><small>Agendamentos ativos</small><strong>'+agenda.filter(a=>a.status==='Confirmado').length+'</strong><span>Aguardando atendimento</span></div>'+
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
  if (abaPainel==='agenda') return
    '<div class="panel"><h3>Agenda de clientes</h3><p>Ao concluir um atendimento, o valor entra no faturamento demonstrativo do profissional e da barbearia.</p>'+tabelaAgenda(agenda)+'</div>';
  if (abaPainel==='faturamento') return
    '<div class="stats"><div class="stat"><small>Serviços concluídos</small><strong>'+dinheiro(financeiro.servicos)+'</strong></div>'+
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
  if (abaPainel==='fotos') return
    '<div class="panel"><h3>Capa da barbearia</h3><p>Esta imagem aparece ao fundo quando o cliente abre sua barbearia.</p>'+
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
function comprimirFoto(arquivo, tamanhoMaximo) {
  return new Promise((resolve,reject)=>{
    if (!arquivo || !['image/jpeg','image/png','image/webp'].includes(arquivo.type)) {
      reject(new Error('Use uma foto JPG, PNG ou WebP.'));return;
    }
    if (arquivo.size>6*1024*1024) {
      reject(new Error('A foto precisa ter no máximo 6 MB.'));return;
    }
    const url=URL.createObjectURL(arquivo);
    const imagem=new Image();
    imagem.onload=()=>{
      const proporcao=Math.min(1,tamanhoMaximo/Math.max(imagem.width,imagem.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(imagem.width*proporcao));
      canvas.height=Math.max(1,Math.round(imagem.height*proporcao));
      const contexto=canvas.getContext('2d');
      contexto.drawImage(imagem,0,0,canvas.width,canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg',0.70));
    };
    imagem.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível ler esta foto.'));};
    imagem.src=url;
  });
}
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
document.addEventListener('input',e=>{
  if (e.target.id==='busca') { filtro.busca=e.target.value; atualizarCards(); }
});
document.addEventListener('change',e=>{
  if (e.target.matches('#upload-capa,#upload-galeria,[data-upload-prof],[data-upload-prod]')) {
    receberFotos(e.target);return;
  }
  if (e.target.id==='bairro') { filtro.bairro=e.target.value; atualizarCards(); }
  if (e.target.id==='ordenacao') { filtro.ordenacao=e.target.value; atualizarCards(); }
  if (['servico','profissional','dia'].includes(e.target.id)) atualizarHorarios();
  if (e.target.id==='selecionar-loja' && minhasLojas().some(b=>b.id===e.target.value)) { barbeariaPainel=e.target.value; telaPainel(); }
});
document.addEventListener('submit',e=>{
  const form=e.target;
  if (!['form-login','form-login-cliente','form-cadastro-cliente','form-cadastro-barbeiro','form-agendar','form-avaliacao','form-compra','form-cadastro','form-aparencia','form-produto'].includes(form.id)) return;
  e.preventDefault();
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
  if (form.id==='form-login-cliente') {
    const usuario=document.querySelector('#cliente-usuario').value.trim().toLowerCase();
    const senha=document.querySelector('#cliente-senha').value;
    const conta=[...CONTAS_CLIENTE_DEMO,...contasClientes].find(c=>c.usuario===usuario && c.senha===senha);
    if(!conta) {aviso('Usuário ou senha de demonstração incorretos.');return;}
    sessionStorage.setItem(CHAVE+'cliente',conta.usuario);
    location.hash='#conta-cliente';renderizar();aviso('Login de cliente realizado!');
    return;
  }
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
  if (form.id==='form-avaliacao') {
    const b=loja(form.dataset.id);
    b.avaliacoes.push({nome:document.querySelector('#avaliador').value.trim(),estrelas:Number(document.querySelector('#estrelas').value),texto:document.querySelector('#comentario').value.trim()});
    salvar(); fecharModal(); telaBarbearia(b.id); aviso('Avaliação publicada nesta demonstração.');
  }
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
  if (form.id==='form-aparencia') {
    const b=loja(barbeariaPainel);
    const pessoas=document.querySelector('#editar-profissionais').value.split(',').map(x=>x.trim()).filter(Boolean);
    if (!pessoas.length) { aviso('Informe pelo menos um profissional.'); return; }
    Object.assign(b,{nome:document.querySelector('#editar-nome').value.trim(),bairro:document.querySelector('#editar-bairro').value.trim(),cor:document.querySelector('#editar-cor').value,descricao:document.querySelector('#editar-descricao').value.trim(),horario:document.querySelector('#editar-horario').value.trim(),profissionais:pessoas});
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
window.addEventListener('hashchange',renderizar);
prepararExemplosIniciais();
aplicarTema();
renderizar();