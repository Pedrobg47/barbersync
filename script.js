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
  { id:'pomada', nome:'Pomada modeladora', preco:35, emoji:'🧴' },
  { id:'oleo', nome:'Óleo para barba', preco:29, emoji:'🪒' }
];
function criarExemplo(id, nome, bairro, foto, nota, quantidade, descricao, cor, profissionais, temProdutos) {
  return {
    id:id, nome:nome, bairro:bairro, foto:foto, fotos:[FOTOS[foto],FOTOS[(foto+1)%6],FOTOS[(foto+2)%6]],
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
  criarExemplo('estacao47','Estação 47 Barber','Alphaville',0,4.9,128,'Um espaço moderno para cuidar do seu visual, com atendimento personalizado e clima descontraído.','#c99457',['Lucas','André','Bruno'],true),
  criarExemplo('nobre','Nobre Barbearia','Centro',1,4.8,94,'Cortes clássicos, tendências atuais e atenção a cada detalhe.','#b7794d',['Gustavo','Matheus'],true),
  criarExemplo('distrito','Distrito do Corte','Jardim Belval',2,4.7,76,'Tradição de barbearia combinada com técnicas e estilos atuais.','#8aa68c',['Pedro','Diego'],false),
  criarExemplo('vertice','Vértice Barber','Jardim Silveira',3,4.9,61,'Ambiente acolhedor, cortes precisos e uma experiência feita para você.','#be9b6c',['Caio','Renato'],true)
];

// 2. LocalStorage guarda dados APENAS neste navegador.
const CHAVE = 'barbersync_tcc_';
function carregar(nome, padrao) {
  try { return JSON.parse(localStorage.getItem(CHAVE+nome)) || padrao; }
  catch (erro) { return padrao; }
}
let barbearias = carregar('barbearias', EXEMPLOS);
let agendamentos = carregar('agendamentos', []);
let pedidos = carregar('pedidos', []);
function salvar() {
  localStorage.setItem(CHAVE+'barbearias', JSON.stringify(barbearias));
  localStorage.setItem(CHAVE+'agendamentos', JSON.stringify(agendamentos));
  localStorage.setItem(CHAVE+'pedidos', JSON.stringify(pedidos));
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
  document.documentElement.style.setProperty('--accent','#c99457');
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
  document.documentElement.style.setProperty('--accent',/^#[0-9a-f]{6}$/i.test(b.cor)?b.cor:'#c99457');
  app.innerHTML=
    '<section class="detail-header"><div class="wrap">'+
      '<div class="breadcrumb"><a href="#inicio">Início</a> / Barbearias / '+seguro(b.nome)+'</div>'+
      '<div class="detail-title-row"><div><span class="eyebrow">✦ BARUERI • '+seguro(b.bairro.toUpperCase())+'</span><h1>'+seguro(b.nome)+'</h1><p>⌖ '+seguro(b.bairro)+', Barueri – SP</p></div>'+
      '<div class="rating">'+estrelas(b)+' <span class="small">• Avaliações de demonstração</span></div></div>'+
    '</div></section>'+
    '<div class="wrap detail-main"><div class="gallery">'+b.fotos.map((foto,i)=>'<img src="'+seguro(foto)+'" alt="Foto ilustrativa '+(i+1)+' da barbearia" loading="lazy">').join('')+'</div>'+
    '<div class="detail-grid"><div>'+
      '<section class="panel"><span class="eyebrow">SOBRE NÓS</span><h3>Conheça nosso espaço</h3><p>'+seguro(b.descricao)+'</p><p class="small">📍 '+seguro(b.bairro)+', Barueri – SP</p><p class="small">🕒 '+seguro(b.horario)+'</p></section>'+
      '<section class="panel"><span class="eyebrow">O QUE FAZEMOS</span><h3>Serviços e valores</h3>'+
        b.servicos.map(s=>'<div class="service-row"><div><strong>'+seguro(s.nome)+'</strong><span>⏱ '+seguro(s.duracao)+'</span></div><strong>'+dinheiro(s.preco)+'</strong></div>').join('')+
      '</section>'+
      '<section class="panel"><span class="eyebrow">NOSSA EQUIPE</span><h3>Profissionais</h3><div class="pros">'+b.profissionais.map(p=>'<span class="pro">✂ '+seguro(p)+'</span>').join('')+'</div></section>'+
      '<section class="panel"><span class="eyebrow">O QUE OS CLIENTES DIZEM</span><h3>Avaliações <span class="rating">'+estrelas(b)+'</span></h3>'+
      '<p class="small">Comentários fictícios ou cadastrados localmente neste navegador.</p>'+
      [...b.avaliacoes].reverse().map(a=>'<div class="review"><div class="review-head"><strong>'+seguro(a.nome)+'</strong><span class="stars">'+('★'.repeat(Number(a.estrelas)))+'</span></div><p>'+seguro(a.texto)+'</p></div>').join('')+
      '<button class="btn btn-outline" data-avaliar="'+seguro(b.id)+'">☆ Escrever avaliação</button></section>'+
      (b.produtos.length ? '<section class="panel"><span class="eyebrow">PRODUTOS DISPONÍVEIS</span><h3>Leve seu estilo para casa</h3><div class="product-grid">'+
        b.produtos.map(p=>'<div class="product"><div class="product-icon">'+seguro(p.emoji)+'</div><strong>'+seguro(p.nome)+'</strong><small>Retirada na barbearia</small><div class="product-bottom"><b>'+dinheiro(p.preco)+'</b><button class="btn btn-sm btn-dark" data-comprar="'+seguro(b.id)+'" data-produto="'+seguro(p.id)+'">Pedir ↗</button></div></div>').join('')+
      '</div></section>' : '')+
    '</div><aside class="panel booking"><span class="eyebrow">RESERVE SEU HORÁRIO</span><h3>Agende seu próximo corte</h3><p class="small">Escolha o serviço e encontre um horário disponível.</p>'+
      '<form id="form-agendar">'+
      '<div class="field"><label for="servico">Serviço</label><select id="servico" required>'+b.servicos.map((s,i)=>'<option value="'+i+'">'+seguro(s.nome)+' — '+dinheiro(s.preco)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label for="profissional">Profissional</label><select id="profissional" required>'+b.profissionais.map(p=>'<option>'+seguro(p)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label for="dia">Data</label><input id="dia" type="date" min="'+hoje()+'" value="'+hoje()+'" required></div>'+
      '<div class="field"><label for="hora">Horário</label><select id="hora" required></select></div>'+
      '<div class="field"><label for="nome-cliente">Seu nome</label><input id="nome-cliente" maxlength="60" placeholder="Nome e sobrenome" required></div>'+
      '<div class="field"><label for="telefone-cliente">WhatsApp</label><input id="telefone-cliente" type="tel" maxlength="20" placeholder="(11) 99999-9999" required></div>'+
      '<div class="price-preview" id="resumo-preco"></div><button type="submit" class="btn btn-primary btn-block">Confirmar agendamento →</button>'+
      '<p class="help">Agendamento de demonstração. Não envia mensagens nem reserva horário em outros dispositivos.</p></form></aside></div></div>';
  atualizarHorarios();
}
function horariosLivres(id,data,profissional) {
  if (!data || data<hoje()) return [];
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
}

// 5. Área do dono: agenda, avaliações, pedidos e personalização.
function telaPainel() {
  const b=loja(barbeariaPainel)||barbearias[0];
  if (!b) return;
  barbeariaPainel=b.id;
  const agenda=agendamentos.filter(a=>a.idLoja===b.id);
  const vendas=pedidos.filter(p=>p.idLoja===b.id);
  const totalVendas=vendas.reduce((s,p)=>s+p.preco,0);
  document.documentElement.style.setProperty('--accent','#c99457');
  const abas=[['visao','▦ Visão geral'],['agenda','▤ Agenda'],['avaliacoes','☆ Avaliações'],['pedidos','▣ Pedidos'],['aparencia','◐ Personalizar'],['catalogo','◈ Produtos']];
  app.innerHTML=
    '<section class="page-intro"><div class="wrap"><div class="eyebrow">GESTÃO DA BARBEARIA</div><h1>Painel do barbeiro</h1><p>Acompanhe atendimentos e personalize a página do seu negócio.</p></div></section>'+
    '<div class="wrap page-content"><div class="owner-note">⚠ Área demonstrativa sem login. Qualquer pessoa neste navegador pode visualizar e alterar os dados fictícios; não utilize dados reais.</div>'+
    '<div class="dashboard"><aside class="sidebar"><small>Menu do estabelecimento</small>'+
      abas.map(a=>'<button class="side-btn '+(abaPainel===a[0]?'active':'')+'" data-aba="'+a[0]+'">'+a[1]+'</button>').join('')+
    '</aside><div class="owner-main"><div class="owner-top"><div><div class="eyebrow">PAINEL DO PARCEIRO</div><h2>'+seguro(b.nome)+'</h2></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><select id="selecionar-loja" aria-label="Selecionar barbearia">'+barbearias.map(x=>'<option value="'+seguro(x.id)+'" '+(x.id===b.id?'selected':'')+'>'+seguro(x.nome)+'</option>').join('')+'</select>'+
      '<button class="btn btn-dark btn-sm" data-cadastrar>+ Cadastrar barbearia</button></div></div>'+
    conteudoPainel(b,agenda,vendas,totalVendas)+
    '</div></div><div style="margin-top:28px"><button class="btn btn-outline btn-sm" data-reset>↺ Restaurar dados da demonstração</button></div></div>';
}
function tabelaAgenda(agenda) {
  if (!agenda.length) return '<p class="muted">Nenhum agendamento registrado. Faça uma reserva na vitrine para vê-la aqui.</p>';
  return '<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Data / Hora</th><th>Status</th></tr></thead><tbody>'+
    [...agenda].sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora)).map(a=>
      '<tr><td><strong>'+seguro(a.cliente)+'</strong><span class="muted small">'+seguro(a.telefone)+'</span></td><td>'+seguro(a.servico)+'</td><td>'+seguro(a.profissional)+'</td><td>'+dataBR(a.data)+' '+seguro(a.hora)+'</td><td><span class="order-label">'+seguro(a.status)+'</span></td></tr>'
    ).join('')+'</tbody></table></div>';
}
function conteudoPainel(b,agenda,vendas,totalVendas) {
  if (abaPainel==='visao') return
    '<div class="stats"><div class="stat"><small>Agendamentos cadastrados</small><strong>'+agenda.filter(a=>a.status!=='Cancelado').length+'</strong><span>Neste navegador</span></div>'+
    '<div class="stat"><small>Pedidos de produtos</small><strong>'+vendas.length+'</strong><span>Pedidos simulados</span></div>'+
    '<div class="stat"><small>Valor dos pedidos</small><strong>'+dinheiro(totalVendas)+'</strong><span>Estimativa fictícia, não é faturamento real</span></div></div>'+
    '<div class="panel"><div class="section-head"><h3>Próximos agendamentos</h3><button class="btn btn-outline btn-sm" data-aba="agenda">Ver agenda</button></div>'+tabelaAgenda(agenda.filter(a=>a.status!=='Cancelado' && a.data>=hoje()))+'</div>'+
    '<div class="panel"><h3>Como apresentar o sistema</h3><p>Abra uma barbearia na vitrine, crie um agendamento e volte para este painel. O registro aparecerá aqui porque o JavaScript salva os dados no localStorage.</p><a class="btn btn-outline" href="#barbearia/'+seguro(b.id)+'">Ver página da barbearia ↗</a></div>';
  if (abaPainel==='agenda') return '<div class="panel"><h3>Agenda de clientes</h3>'+tabelaAgenda(agenda)+'</div>';
  if (abaPainel==='avaliacoes') return '<div class="panel"><h3>Avaliações de '+seguro(b.nome)+'</h3><p>Nota demonstrativa: <strong>'+estrelas(b)+'</strong></p>'+
    [...b.avaliacoes].reverse().map(a=>'<div class="review"><div class="review-head"><strong>'+seguro(a.nome)+'</strong><span class="stars">'+('★'.repeat(Number(a.estrelas)))+'</span></div><p>'+seguro(a.texto)+'</p></div>').join('')+'</div>';
  if (abaPainel==='pedidos') return '<div class="panel"><h3>Pedidos realizados</h3><p>Fluxo simulado. Não há cobrança ou processamento de pagamento.</p>'+
    (vendas.length ? '<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th></tr></thead><tbody>'+
     [...vendas].reverse().map(p=>'<tr><td>'+seguro(p.cliente)+'</td><td>'+seguro(p.produto)+'</td><td>'+dinheiro(p.preco)+'</td><td><span class="order-label">Aguardando retirada</span></td></tr>').join('')+
     '</tbody></table></div>' : '<p class="muted">Nenhum pedido por enquanto.</p>')+'</div>';
  if (abaPainel==='aparencia') return '<div class="panel"><h3>Personalizar minha barbearia</h3><p>Estas mudanças aparecem imediatamente na página pública deste navegador.</p>'+
    '<form id="form-aparencia" class="form-grid">'+
      '<div class="full">'+campo('Nome da barbearia','editar-nome',b.nome)+'</div>'+
      '<div class="field"><label for="editar-bairro">Bairro</label><input id="editar-bairro" value="'+seguro(b.bairro)+'" required></div>'+
      '<div class="field"><label for="editar-cor">Cor principal da página</label><input id="editar-cor" type="color" value="'+seguro(b.cor)+'"></div>'+
      '<div class="field full"><label for="editar-descricao">Descrição</label><textarea id="editar-descricao" required>'+seguro(b.descricao)+'</textarea></div>'+
      '<div class="field full"><label for="editar-horario">Horário de funcionamento</label><input id="editar-horario" value="'+seguro(b.horario)+'" required></div>'+
      '<div class="field full"><label for="editar-profissionais">Profissionais (separados por vírgula)</label><input id="editar-profissionais" value="'+seguro(b.profissionais.join(', '))+'" required></div>'+
      '<div class="full"><div class="color-preview" style="border-left:9px solid '+seguro(b.cor)+'"><strong>'+seguro(b.nome)+'</strong><br><span class="small">Prévia simples da sua marca</span></div></div>'+
      '<div class="full">'+botao('Salvar personalização')+'</div></form></div>';
  if (abaPainel==='catalogo') return '<div class="panel"><h3>Gerenciar produtos</h3><p>Cadastre itens simples para aparecerem na página da barbearia.</p>'+
    '<form id="form-produto" class="form-grid"><div class="field"><label for="novo-produto">Nome do produto</label><input id="novo-produto" maxlength="60" required></div>'+
    '<div class="field"><label for="novo-preco">Preço (R$)</label><input id="novo-preco" type="number" min="1" step="0.01" required></div>'+
    '<div class="full">'+botao('+ Adicionar produto')+'</div></form></div>'+
    '<div class="panel"><h3>Produtos cadastrados</h3>'+
      (b.produtos.length?b.produtos.map(p=>'<div class="list-row"><div><strong>'+seguro(p.nome)+'</strong><span>'+dinheiro(p.preco)+'</span></div><button class="btn btn-outline btn-sm" data-remover-produto="'+seguro(p.id)+'">Excluir</button></div>').join(''):'<p class="muted">Nenhum produto cadastrado.</p>')+'</div>';
  return '';
}

// 6. Histórico local, cadastro, avaliações e checkout fictício.
function telaMeusAgendamentos() {
  document.documentElement.style.setProperty('--accent','#c99457');
  app.innerHTML='<section class="page-intro"><div class="wrap"><div class="eyebrow">SEUS HORÁRIOS</div><h1>Meus agendamentos</h1><p>Reservas feitas neste navegador durante a demonstração.</p></div></section>'+
  '<div class="wrap page-content"><div class="owner-note">Os registros não são vinculados a uma conta real. Não use informações pessoais de verdade.</div>'+
  (agendamentos.length ? [...agendamentos].reverse().map(a=>
    '<div class="account-card"><span class="eyebrow">'+seguro(a.status)+'</span><h3>'+seguro((loja(a.idLoja)||{}).nome||'Barbearia')+'</h3>'+
    '<p>'+seguro(a.servico)+' com '+seguro(a.profissional)+' • '+dataBR(a.data)+' às '+seguro(a.hora)+'</p>'+
    '<div class="list-row"><strong>'+dinheiro(a.preco)+'</strong>'+(a.status!=='Cancelado'?'<button class="btn btn-outline btn-sm" data-cancelar="'+a.id+'">Cancelar agendamento</button>':'<span class="muted small">Cancelado</span>')+'</div></div>'
    ).join('') : '<div class="empty"><h3>Sem agendamentos por aqui</h3><p>Escolha uma barbearia e reserve um horário.</p><a class="btn btn-primary" href="#inicio">Explorar barbearias</a></div>')+
  '</div>';
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
    '<p class="muted small">Cadastre um novo exemplo para aparecer na vitrine. Não é necessário ter uma conta.</p>'+
    '<form id="form-cadastro">'+campo('Nome da barbearia','cad-nome','')+
      '<div class="field"><label for="cad-bairro">Bairro em Barueri</label><select id="cad-bairro"><option>Alphaville</option><option>Centro</option><option>Jardim Belval</option><option>Jardim Silveira</option><option>Parque Imperial</option><option>Outro bairro</option></select></div>'+
      '<div class="field"><label for="cad-descricao">Descrição</label><textarea id="cad-descricao" maxlength="250" required></textarea></div>'+botao('Criar barbearia')+'</form>');
}
function renderizar() {
  fecharModal();
  const rota=decodeURIComponent(location.hash||'#inicio');
  if (rota.startsWith('#barbearia/')) telaBarbearia(rota.split('/')[1]);
  else if (rota==='#painel') telaPainel();
  else if (rota==='#meus-agendamentos') telaMeusAgendamentos();
  else telaInicio();
  window.scrollTo(0,0);
}

// 7. Eventos: todos os cliques e formulários passam por estes ouvintes.
document.addEventListener('click',e=>{
  const el=e.target;
  const card=el.closest('[data-loja]');
  if (card) location.hash='#barbearia/'+card.dataset.loja;
  if (el.closest('[data-fechar]')||el.classList.contains('modal-backdrop')) fecharModal();
  const tipo=el.closest('[data-tipo]');
  if (tipo) { filtro.tipo=tipo.dataset.tipo; document.querySelectorAll('[data-tipo]').forEach(b=>b.classList.toggle('active',b===tipo)); atualizarCards(); }
  if (el.id==='limpar-filtros') { filtro={busca:'',bairro:'Todos',ordenacao:'nota',tipo:'Todos'}; telaInicio(); }
  const aval=el.closest('[data-avaliar]'); if (aval) modalAvaliacao(aval.dataset.avaliar);
  const comprar=el.closest('[data-comprar]'); if (comprar) modalCompra(comprar.dataset.comprar,comprar.dataset.produto);
  const aba=el.closest('[data-aba]'); if (aba) { abaPainel=aba.dataset.aba; telaPainel(); }
  if (el.closest('[data-cadastrar]')) modalCadastro();
  const cancel=el.closest('[data-cancelar]');
  if (cancel && confirm('Cancelar este agendamento de demonstração?')) {
    const a=agendamentos.find(x=>String(x.id)===cancel.dataset.cancelar);
    if (a) { a.status='Cancelado'; salvar(); telaMeusAgendamentos(); aviso('Agendamento cancelado.'); }
  }
  const remover=el.closest('[data-remover-produto]');
  if (remover) { const b=loja(barbeariaPainel); b.produtos=b.produtos.filter(p=>p.id!==remover.dataset.removerProduto); salvar(); telaPainel(); aviso('Produto excluído.'); }
  if (el.closest('[data-reset]') && confirm('Apagar todas as alterações e agendamentos desta demonstração?')) {
    ['barbearias','agendamentos','pedidos'].forEach(k=>localStorage.removeItem(CHAVE+k));
    barbearias=JSON.parse(JSON.stringify(EXEMPLOS)); agendamentos=[]; pedidos=[]; barbeariaPainel=barbearias[0].id; abaPainel='visao'; telaPainel(); aviso('Dados de demonstração restaurados.');
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
  if (e.target.id==='bairro') { filtro.bairro=e.target.value; atualizarCards(); }
  if (e.target.id==='ordenacao') { filtro.ordenacao=e.target.value; atualizarCards(); }
  if (['servico','profissional','dia'].includes(e.target.id)) atualizarHorarios();
  if (e.target.id==='selecionar-loja') { barbeariaPainel=e.target.value; telaPainel(); }
});
document.addEventListener('submit',e=>{
  const form=e.target;
  if (!['form-agendar','form-avaliacao','form-compra','form-cadastro','form-aparencia','form-produto'].includes(form.id)) return;
  e.preventDefault();
  if (form.id==='form-agendar') {
    const b=loja(location.hash.split('/')[1]);
    const servico=b.servicos[Number(document.querySelector('#servico').value)];
    const profissional=document.querySelector('#profissional').value;
    const data=document.querySelector('#dia').value;
    const hora=document.querySelector('#hora').value;
    if (!horariosLivres(b.id,data,profissional).includes(hora)) { aviso('Este horário não está mais disponível.'); atualizarHorarios(); return; }
    const cliente=document.querySelector('#nome-cliente').value.trim(), telefone=document.querySelector('#telefone-cliente').value.trim();
    if (!cliente||!telefone) return;
    agendamentos.push({id:Date.now(),idLoja:b.id,cliente:cliente,telefone:telefone,servico:servico.nome,profissional:profissional,data:data,hora:hora,preco:servico.preco,status:'Confirmado'});
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
    novo.avaliacoes=[];
    barbearias.push(novo); barbeariaPainel=novo.id; abaPainel='aparencia';
    salvar(); fecharModal(); telaPainel(); aviso('Barbearia adicionada à vitrine!');
  }
  if (form.id==='form-aparencia') {
    const b=loja(barbeariaPainel);
    const pessoas=document.querySelector('#editar-profissionais').value.split(',').map(x=>x.trim()).filter(Boolean);
    if (!pessoas.length) { aviso('Informe pelo menos um profissional.'); return; }
    Object.assign(b,{nome:document.querySelector('#editar-nome').value.trim(),bairro:document.querySelector('#editar-bairro').value.trim(),cor:document.querySelector('#editar-cor').value,descricao:document.querySelector('#editar-descricao').value.trim(),horario:document.querySelector('#editar-horario').value.trim(),profissionais:pessoas});
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
renderizar();