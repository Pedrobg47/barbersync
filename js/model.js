/* MVC — MODEL (Modelo): dados, armazenamento e regras do BarberSync.
   O Model não desenha telas. Os dados são locais e fictícios para o TCC. */

/* BARBERSYNC — protótipo TCC. Sem bibliotecas, servidor ou banco de dados. */

// 1. Dados fictícios usados para demonstrar as telas.
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-M01] DADOS INICIAIS — fotos, serviços e produtos fictícios ║
// ╚══════════════════════════════════════════════════════════════╝
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
// [TCC-M02] Monta uma barbearia de exemplo com nome, bairro, profissionais e produtos.
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
// [TCC-M03] Quatro barbearias fictícias para aparecerem na página inicial.
const EXEMPLOS = [
  criarExemplo('estacao47','Estação 47 Barber','Alphaville',0,4.9,128,'Um espaço moderno para cuidar do seu visual, com atendimento personalizado e clima descontraído.','#d8aa56',['Lucas','André','Bruno'],true),
  criarExemplo('nobre','Nobre Barbearia','Centro',1,4.8,94,'Cortes clássicos, tendências atuais e atenção a cada detalhe.','#c39651',['Gustavo','Matheus'],true),
  criarExemplo('distrito','Distrito do Corte','Jardim Belval',2,4.7,76,'Tradição de barbearia combinada com técnicas e estilos atuais.','#c6a160',['Pedro','Diego'],false),
  criarExemplo('vertice','Vértice Barber','Jardim Silveira',3,4.9,61,'Ambiente acolhedor, cortes precisos e uma experiência feita para você.','#e3b864',['Caio','Renato'],true)
];

// 2. LocalStorage guarda dados APENAS neste navegador.
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-M04] PERSISTÊNCIA LOCAL (simulação de banco de dados)     ║
// ╚══════════════════════════════════════════════════════════════╝
// localStorage mantém os dados no navegador mesmo após atualizar a página.
// Importante: não sincroniza com outros dispositivos e não é seguro para dados reais.
const CHAVE = 'barbersync_tcc_';
// [TCC-M05] Lê do localStorage. Se não houver dados, usa os exemplos iniciais.
function carregar(nome, padrao) {
  try { return JSON.parse(localStorage.getItem(CHAVE+nome)) || padrao; }
  catch (erro) { return padrao; }
}
let barbearias = carregar('barbearias', JSON.parse(JSON.stringify(EXEMPLOS)));
let agendamentos = carregar('agendamentos', []);
let pedidos = carregar('pedidos', []);
let contasBarbeiros = carregar('contasBarbeiros', []);
let contasClientes = carregar('contasClientes', []);
// [TCC-M06] Salva barbearias, reservas, pedidos e contas fictícias no navegador.
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
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-M07] CONTAS e PLANOS — APENAS PARA DEMONSTRAÇÃO           ║
// ╚══════════════════════════════════════════════════════════════╝
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
// [TCC-M08] Valores ilustrativos de mensalidade. Não há cobrança de verdade.
const PLANOS = [
  {id:'essencial',nome:'Essencial',preco:39.90,descricao:'Para começar sua presença digital.',recursos:['Vitrine com fotos e avaliações','Agendamento demonstrativo','Cadastro de serviços e equipe']},
  {id:'profissional',nome:'Profissional',preco:79.90,descricao:'Para organizar a rotina da barbearia.',recursos:['Tudo do plano Essencial','Painel de agenda e faturamento','Fotos de profissionais e produtos','Visão geral das avaliações']},
  {id:'premium',nome:'Premium',preco:129.90,descricao:'Uma experiência completa para seu negócio.',recursos:['Tudo do plano Profissional','Destaque visual na vitrine','Personalização ampliada','Suporte prioritário (proposta futura)']}
];
const minhasLojas = () => barbearias.filter(b=>(b.dono || b.id)===donoLogado());
const podeEditar = b => !!b && !!donoLogado() && (b.dono || b.id)===donoLogado();

// [TCC-M09] Funções auxiliares usadas pelas outras camadas.
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

// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-M10] REGRA DE AGENDAMENTO — PROCURE ESTA PARTE NA BANCA   ║
// ╚══════════════════════════════════════════════════════════════╝
// Procura os próximos dias até encontrar um que tenha horário livre.
function proximaDataDisponivel(id,profissional) {
  for(let i=0;i<15;i++) {
    const d=new Date();d.setDate(d.getDate()+i);
    const data=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    if (horariosLivres(id,data,profissional).length) return data;
  }
  return hoje();
}
// [TCC-M11] Confere data, funcionamento e reservas já existentes.
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
// [TCC-M12] Cria reservas e vendas fictícias identificadas como EXEMPLO,
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
// [TCC-M13] Insere dados fictícios somente na primeira inicialização,
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
// ╔══════════════════════════════════════════════════════════════╗
// ║ [TCC-M14] FATURAMENTO POR BARBEIRO E TOTAL DA BARBEARIA        ║
// ╚══════════════════════════════════════════════════════════════╝
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

// [TCC-M15] Fotos: usa Canvas para reduzir imagens antes de salvar localmente.
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

