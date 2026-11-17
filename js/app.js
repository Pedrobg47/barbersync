/* BARBERSYNC | Código do site
   Arquivo de dados, telas, formulários e eventos.
   Dados demonstrativos são mantidos no armazenamento do navegador.
*/

// ======================= DADOS E REGRAS =======================
// 1. Dados fictícios usados para demonstrar as telas.
// Estas listas são objetos JavaScript; NÃO existe banco de dados nesta versão.
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
// É uma fábrica de objetos: vários estabelecimentos usam o mesmo formato.
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
// localStorage mantém os dados no navegador mesmo após atualizar a página.
// Importante: não sincroniza com outros dispositivos e não é seguro para dados reais.
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
// Se o armazenamento ficar cheio (fotos), mostra uma mensagem de aviso.
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
// As senhas abaixo NÃO são protegidas. No produto real precisaria de servidor.
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

// seguro() evita que textos digitados sejam interpretados como HTML.
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

// Procura os próximos dias até encontrar um que tenha horário livre.
function proximaDataDisponivel(id,profissional) {
  for(let i=0;i<15;i++) {
    const d=new Date();d.setDate(d.getDate()+i);
    const data=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    if (horariosLivres(id,data,profissional).length) return data;
  }
  return hoje();
}
// Dois clientes NÃO podem reservar a mesma hora com o mesmo barbeiro
// neste navegador. É uma simulação local, não uma agenda sincronizada.
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

function dataRelativa(dias) {
  const d=new Date();d.setDate(d.getDate()+dias);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
// para a agenda e o financeiro não começarem vazios na apresentação.
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
// preservando os dados que o aluno cadastrou depois.
function prepararExemplosIniciais() {
  if(localStorage.getItem(CHAVE+'dadosDemonstracaoV3')) return;
  if(!agendamentos.length && !pedidos.length) {
    barbearias.filter(b=>['estacao47','nobre','distrito','vertice'].includes(b.id)).forEach(inserirExemplosLoja);
    salvar();
  }
  localStorage.setItem(CHAVE+'dadosDemonstracaoV3','1');
}

// 5. Área do dono: agenda, avaliações, pedidos e personalização.
// Só conta serviços com status "Concluído" e produtos "Entregue".
// Retorna os valores para o painel; NÃO significa dinheiro recebido de verdade.
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

// Não envia arquivos para servidor ou API.
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

// ======================= TELAS E COMPONENTES =======================

// Cada grupo de telas está em um arquivo HTML próprio.
const arquivosDeTelas = [
  'templates/01-paginas.html',
  'templates/02-painel.html',
  'templates/03-componentes.html',
  'templates/04-janelas.html'
];

// Os modelos precisam estar disponíveis antes da primeira renderização.
// Para abrir localmente, use Live Server no VS Code.
async function carregarModelosHTML() {
  const area = document.getElementById('modelos-html');

  for (const arquivo of arquivosDeTelas) {
    const resposta = await fetch(arquivo);

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar: ' + arquivo);
    }

    const html = await resposta.text();
    area.insertAdjacentHTML('beforeend', html);
  }
}

// HTML das páginas e componentes fica na pasta templates/.
// Aqui colocamos apenas os valores variáveis e as interações.
function htmlTela(id, valores = []) {
  const elemento = document.getElementById(id);
  if (!elemento) throw new Error('Modelo HTML não encontrado: ' + id);
  const conteudo = elemento.textContent;
  const pronto = elemento.dataset.formatado === 'sim'
    ? conteudo.replace(/\r?\n[ \t]*/g, '')
    : conteudo;
  return pronto.replace(/__BS_VAL_(\d+)__/g, (_, numero) => String(valores[Number(numero)]));
}


function aplicarTema() {
  const escuro = localStorage.getItem(CHAVE+'tema')!=='claro';
  document.body.classList.toggle('theme-dark',escuro);
  document.querySelector('#theme-label').textContent=escuro?'Claro':'Escuro';
  document.querySelector('#theme-toggle').setAttribute('aria-label',escuro?'Ativar modo claro':'Ativar modo escuro');
}
// O logo leva de volta à página inicial da plataforma.
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
  return htmlTela("componente-abas-acesso", [((tipo==='cliente'?'active':'')), ((tipo==='barbeiro'?'active':''))]);
}
// Atenção: aqui apenas DESENHAMOS os formulários.
function telaLogin() {
  if (donoLogado()) { location.hash='#painel';return; }
  document.documentElement.style.setProperty('--accent','#d8aa56');
  app.innerHTML=htmlTela("pagina-login-barbeiro", [(abasAcesso('barbeiro')), (campo('Usuário','login-usuario','')), (campo('Senha','login-senha','','password'))]);
}
function telaLoginCliente() {
  if (clienteLogado()) { location.hash='#conta-cliente';return; }
  app.innerHTML=htmlTela("pagina-login-cliente", [(abasAcesso('cliente')), (campo('Usuário','cliente-usuario','')), (campo('Senha','cliente-senha','','password'))]);
}
function telaCadastroCliente() {
  app.innerHTML=htmlTela("pagina-cadastro-cliente", [(abasAcesso('cliente')), (campo('Nome para demonstração','cliente-nome','')), (campo('Usuário (mín. 4 caracteres)','novo-cliente-usuario','')), (campo('Senha demonstrativa (mín. 4 caracteres)','novo-cliente-senha','','password')), (campo('Telefone fictício (opcional)','novo-cliente-telefone','','tel').replace(' required>','>'))]);
}
function telaCadastroBarbeiro() {
  const escolhido=(location.hash.split('/')[1]||'profissional').toLowerCase();
  app.innerHTML=htmlTela("pagina-cadastro-barbeiro", [(abasAcesso('barbeiro')), (campo('Nome do responsável','dono-nome','')), (campo('Usuário (mín. 4 caracteres)','dono-usuario','')), (campo('Senha demonstrativa (mín. 4 caracteres)','dono-senha','','password')), (campo('Nome da barbearia','dono-barbearia','')), (PLANOS.map(p=>'<option value="'+p.id+'" '+(p.id===escolhido?'selected':'')+'>'+p.nome+' — '+dinheiro(p.preco)+'/mês</option>').join(''))]);
}
function telaContaCliente() {
  if (!clienteLogado()) { location.hash='#login-cliente';return; }
  const usuario=dadosCliente();
  const seus=agendamentos.filter(a=>a.clienteUsuario===clienteLogado());
  app.innerHTML=htmlTela("pagina-minha-conta", [(seguro(usuario?.nome||'cliente')), (cardsAgendamentos(seus))]);
}
function telaPlanos() {
  app.innerHTML=htmlTela("pagina-planos", [(PLANOS.map((p,i)=>
      htmlTela("componente-card-plano", [((i===1?'featured':'')), ((i===1?'✦ MAIS POPULAR':'BARBERSYNC')), (p.nome), (p.descricao), (dinheiro(p.preco)), (p.recursos.map(t=>'<li>'+seguro(t)+'</li>').join('')), ((i===1?'btn-primary':'btn-dark')), (p.id)])).join(''))]);
}
function telaPoliticas() {
  app.innerHTML=htmlTela("pagina-politicas", []);
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
  return htmlTela("componente-cabecalho-modal", [(seguro(titulo))]);
}
function campo(rotulo,id,valor,tipo) {
  return htmlTela("componente-campo-formulario", [(id), (rotulo), (id), (id), ((tipo||'text')), (seguro(valor||''))]);
}
function botao(texto,classe) {
  return '<button class="btn '+(classe||'btn-primary')+'" type="submit">'+texto+'</button>';
}

// 3. Página inicial: busca, filtros e vitrine de barbearias.
// Cria a página HTML da vitrine. A busca/ordenacão atualiza os cards.
function telaInicio() {
  document.documentElement.style.setProperty('--accent','#d8aa56');
  app.innerHTML =
    htmlTela("pagina-inicio-vitrine", [(seguro(filtro.busca)), ([...new Set(barbearias.map(b=>b.bairro))].sort().map(b=>'<option '+(filtro.bairro===b?'selected':'')+'>'+seguro(b)+'</option>').join('')), (['Todos','Corte','Barba','Produtos'].map(t=>'<button class="pill '+(filtro.tipo===t?'active':'')+'" data-tipo="'+t+'">'+t+'</button>').join(''))]);
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
    htmlTela("componente-card-vitrine", [(seguro(b.id)), (seguro(b.nome)), (seguro(b.fotos[0])), (seguro(b.bairro)), (seguro(b.nome)), (estrelas(b)), (seguro(b.descricao)), (dinheiro(menorPreco(b)))])).join('') : '<div class="empty">Nenhuma barbearia encontrada. Tente outro filtro.</div>';
}

// 4. Perfil individual, horários, serviços, produtos e avaliações.
// Monta capa, galeria, fotos da equipe, produtos e o formulário de reserva.
function telaBarbearia(id) {
  const b=loja(id);
  if (!b) { location.hash='#inicio'; return; }
  document.documentElement.style.setProperty('--accent',/^#[0-9a-f]{6}$/i.test(b.cor)?b.cor:'#d8aa56');
  app.innerHTML=
    htmlTela("pagina-perfil-barbearia", [(seguro(b.capa||b.fotos[0])), (seguro(b.nome)), (seguro(b.bairro.toUpperCase())), (seguro(b.nome)), (seguro(b.bairro)), (estrelas(b)), ((podeEditar(b)?'<p style="margin:18px 0 0"><button class="btn btn-primary btn-sm" data-editar-loja="'+seguro(b.id)+'">✎ Editar minha barbearia</button></p>':'')), (b.fotos.map((foto,i)=>'<img src="'+seguro(foto)+'" alt="Foto '+(i+1)+' da barbearia" loading="lazy">').join('')), (seguro(b.descricao)), (seguro(b.bairro)), (seguro(b.horario)), (b.servicos.map(s=>htmlTela("componente-linha-servico", [(seguro(s.nome)), (seguro(s.duracao)), (dinheiro(s.preco))])).join('')), (b.profissionais.map(p=>
        htmlTela("componente-card-profissional", [(((b.fotosProfissionais||{})[p]?'<img src="'+seguro(b.fotosProfissionais[p])+'" alt="Foto de '+seguro(p)+'">':'<div class="pro-avatar">'+seguro(p.slice(0,1).toUpperCase())+'</div>')), (seguro(p))])).join('')), (estrelas(b)), ([...b.avaliacoes].reverse().map(a=>htmlTela("componente-avaliacao-barbearia", [(seguro(a.nome)), (('★'.repeat(Number(a.estrelas)))), (seguro(a.texto))])).join('')), (seguro(b.id)), ((b.produtos.length ? '<section class="panel"><span class="eyebrow">PRODUTOS DISPONÍVEIS</span><h3>Leve seu estilo para casa</h3><div class="product-grid">'+
        b.produtos.map(p=>htmlTela("componente-produto-barbearia", [((p.imagem?'<img src="'+seguro(p.imagem)+'" alt="Foto de '+seguro(p.nome)+'">':'<span aria-label="Sem foto cadastrada">'+seguro(p.emoji||'🧴')+'</span>')), (seguro(p.nome)), (dinheiro(p.preco)), (seguro(b.id)), (seguro(p.id))])).join('')+
      '</div></section>' : '')), (b.servicos.map((s,i)=>'<option value="'+i+'">'+seguro(s.nome)+' — '+dinheiro(s.preco)+'</option>').join('')), (b.profissionais.map(p=>'<option>'+seguro(p)+'</option>').join('')), (hoje()), (proximaDataDisponivel(b.id,b.profissionais[0])), (seguro(nomeCliente())), (seguro(telefoneCliente()))]);
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

// Recebe os dados já armazenados, escolhe a barbearia e monta o painel.
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
    htmlTela("pagina-painel-barbeiro", [(seguro((PLANOS.find(p=>p.id===b.plano)||PLANOS[1]).nome)), (abas.map(a=>'<button class="side-btn '+(abaPainel===a[0]?'active':'')+'" data-aba="'+a[0]+'">'+a[1]+'</button>').join('')), (seguro(b.nome)), (disponiveis.map(x=>'<option value="'+seguro(x.id)+'" '+(x.id===b.id?'selected':'')+'>'+seguro(x.nome)+'</option>').join('')), (conteudoPainel(b,agenda,vendas,financeiro))]);
}
function tabelaAgenda(agenda) {
  if (!agenda.length) return htmlTela("componente-agenda-vazia", []);
  return htmlTela("componente-tabela-agenda", [([...agenda].sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora)).map(a=>
      htmlTela("componente-linha-agendamento", [(seguro(a.cliente)), ((a.exemplo?'<span class="tag">EXEMPLO</span>':'')), (seguro(a.telefone)), (seguro(a.servico)), (seguro(a.profissional)), (dataBR(a.data)), (seguro(a.hora)), (seguro(a.status)), ((a.status==='Confirmado'?'<button class="btn btn-primary btn-sm" data-concluir="'+seguro(a.id)+'">Concluir</button>':'—'))])).join(''))]);
}
function conteudoPainel(b,agenda,vendas,financeiro) {
  if (abaPainel==='visao') return     htmlTela("painel-visao-geral", [(agenda.filter(a=>a.status==='Confirmado').length), (dinheiro(financeiro.servicos)), (dinheiro(financeiro.produtos)), (dinheiro(financeiro.total)), (tabelaAgenda(agenda.filter(a=>a.status==='Confirmado' && a.data>=hoje()))), (tabelaFaturamento(financeiro.profissionais)), (painelAvaliacoes(b)), (seguro(b.id))]);
  if (abaPainel==='agenda') return     htmlTela("painel-agenda", [(tabelaAgenda(agenda))]);
  if (abaPainel==='faturamento') return     htmlTela("painel-faturamento", [(dinheiro(financeiro.servicos)), (dinheiro(financeiro.produtos)), (dinheiro(financeiro.total)), (tabelaFaturamento(financeiro.profissionais))]);
  if (abaPainel==='avaliacoes') return htmlTela("painel-avaliacoes", [(painelAvaliacoes(b)), (seguro(b.nome)), ([...b.avaliacoes].reverse().map(a=>htmlTela("componente-comentario-painel", [(seguro(a.nome)), (('★'.repeat(Number(a.estrelas)))), (seguro(a.texto))])).join(''))]);
  if (abaPainel==='pedidos') return htmlTela("painel-pedidos", [((vendas.length ? '<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead><tbody>'+
     [...vendas].reverse().map(p=>htmlTela("componente-linha-pedido", [(seguro(p.cliente)), (seguro(p.produto)), (dinheiro(p.preco)), (seguro(p.status||'Aguardando retirada')), ((p.status==='Entregue'?'—':'<button class="btn btn-primary btn-sm" data-entregar="'+seguro(p.id)+'">Entregue</button>'))])).join('')+
     '</tbody></table></div>' : '<p class="muted">Nenhum pedido por enquanto.</p>'))]);
  if (abaPainel==='aparencia') return htmlTela("painel-informacoes", [(campo('Nome da barbearia','editar-nome',b.nome)), (seguro(b.bairro)), (seguro(b.cor)), (seguro(b.descricao)), (seguro(b.horario)), (seguro(b.profissionais.join(', '))), (seguro(b.cor)), (seguro(b.nome)), (botao('Salvar alterações'))]);
  if (abaPainel==='fotos') return     htmlTela("painel-fotos-equipe", [(seguro(b.capa||b.fotos[0])), (b.fotos.map((foto,i)=>htmlTela("componente-foto-galeria", [(seguro(foto)), ((i+1)), (i), ((b.fotos.length===1?'disabled':''))])).join('')), (b.profissionais.map(p=>htmlTela("componente-foto-profissional", [(((b.fotosProfissionais||{})[p]?'<img src="'+seguro(b.fotosProfissionais[p])+'" alt="Foto de '+seguro(p)+'">':'<div class="pro-avatar">'+seguro(p.slice(0,1).toUpperCase())+'</div>')), (seguro(p)), (seguro(p)), (((b.fotosProfissionais||{})[p]?'<button class="btn btn-outline btn-sm" data-remover-foto-prof="'+seguro(p)+'">Remover foto</button>':''))])).join(''))]);
  if (abaPainel==='catalogo') return htmlTela("painel-catalogo", [(botao('+ Adicionar produto')), ((b.produtos.length?b.produtos.map(p=>
        htmlTela("componente-item-produto-painel", [((p.imagem?'<img class="product-photo-small" src="'+seguro(p.imagem)+'" alt="Foto de '+seguro(p.nome)+'">':'<div class="product-thumb product-photo-small">'+seguro(p.emoji||'🧴')+'</div>')), (seguro(p.nome)), (dinheiro(p.preco)), (seguro(p.id)), (seguro(p.id))])).join(''):'<p class="muted">Nenhum produto cadastrado.</p>'))]);
  return '';
}
function painelAvaliacoes(b) {
  const lista=b.avaliacoes||[],total=lista.length;
  const media=total?lista.reduce((s,a)=>s+Number(a.estrelas),0)/total:0;
  const linhas=[5,4,3,2,1].map(n=>{
    const q=lista.filter(a=>Number(a.estrelas)===n).length;
    const largura=total?Math.round(q*100/total):0;
    return htmlTela("componente-linha-avaliacao", [(n), (largura), (q)]);
  }).join('');
  return htmlTela("componente-resumo-avaliacoes", [(media.toFixed(1)), (total), (linhas), (notaMedia(b).toFixed(1))]);
}
function tabelaFaturamento(profissionais) {
  return htmlTela("componente-tabela-faturamento", [(profissionais.map(p=>'<tr><td>'+seguro(p.nome)+'</td><td>'+p.atendimentos+'</td><td>'+dinheiro(p.total)+'</td></tr>').join(''))]);
}

// 6. Histórico local, cadastro, avaliações e checkout fictício.
function cardsAgendamentos(lista) {
  if (!lista.length) return htmlTela("componente-agendamentos-vazios", []);
  return [...lista].reverse().map(a=>
    htmlTela("componente-card-agendamento", [(seguro(a.status)), (seguro((loja(a.idLoja)||{}).nome||'Barbearia')), (seguro(a.servico)), (seguro(a.profissional)), (dataBR(a.data)), (seguro(a.hora)), (dinheiro(a.preco)), ((a.status==='Confirmado'?'<button class="btn btn-outline btn-sm" data-cancelar="'+a.id+'">Cancelar agendamento</button>':'<span class="muted small">'+(a.status==='Concluído'?'Atendimento realizado':'Cancelado')+'</span>'))])).join('');
}
function telaMeusAgendamentos() {
  document.documentElement.style.setProperty('--accent','#d8aa56');
  const logado=!!clienteLogado();
  const seus=agendamentos.filter(a=>logado?a.clienteUsuario===clienteLogado():!a.clienteUsuario&&!a.exemplo);
  app.innerHTML=htmlTela("pagina-meus-agendamentos", [((logado?'Mostrando reservas vinculadas à sua conta de demonstração.':'Você está como visitante. <a href="#login-cliente">Entre como cliente</a> para vincular novos agendamentos à sua conta.')), (cardsAgendamentos(seus))]);
}
function modalAvaliacao(id) {
  abrirModal(htmlTela("modal-avaliacao", [(cabecalhoModal('Avaliar barbearia')), (seguro(id)), (campo('Seu nome','avaliador','')), (botao('Publicar avaliação'))]));
}
function modalCompra(idLoja,idProduto) {
  const b=loja(idLoja);
  const p=b && b.produtos.find(x=>x.id===idProduto);
  if (!p) return;
  abrirModal(htmlTela("modal-compra", [(cabecalhoModal('Finalizar pedido')), (seguro(p.nome)), (dinheiro(p.preco)), (seguro(idLoja)), (seguro(idProduto)), (campo('Seu nome','comprador','')), (campo('Telefone','tel-comprador','','tel')), (dinheiro(p.preco)), (botao('Confirmar pedido de demonstração'))]));
}
function modalCadastro() {
  abrirModal(htmlTela("modal-cadastro-barbearia", [(cabecalhoModal('Cadastrar nova barbearia')), (campo('Nome da barbearia','cad-nome','')), (botao('Criar barbearia'))]));
}
// Reduz as fotos no próprio navegador (sem upload, servidor ou API).

// ======================= NAVEGAÇÃO E INTERAÇÕES =======================
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
// submit é o envio de um formulário. e.preventDefault() evita recarregar.
document.addEventListener('submit',e=>{
  const form=e.target;
  if (!['form-login','form-login-cliente','form-cadastro-cliente','form-cadastro-barbeiro','form-agendar','form-avaliacao','form-compra','form-cadastro','form-aparencia','form-produto'].includes(form.id)) return;
  e.preventDefault();
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
    abrirModal(htmlTela("modal-agendamento-confirmado", [(cabecalhoModal('Agendamento registrado!')), (seguro(b.nome)), (dataBR(data)), (seguro(hora))]));
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
