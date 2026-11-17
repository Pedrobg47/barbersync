// As páginas ficam em HTML. Aqui montamos as telas e colocamos os dados.

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
  // Cada marcador do HTML recebe um valor desta tela.
  return elemento.textContent.replace(/__BS_VAL_(\d+)__/g, (marcador, numero) => {
    return String(valores[Number(numero)] ?? '');
  });
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
// Estas funções montam os formulários; o envio fica em 05-formularios.js.
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
  app.innerHTML=htmlTela("pagina-cadastro-cliente", [(abasAcesso('cliente')), (campo('Nome para demonstração',
      'cliente-nome','')), (campo('Usuário (mín. 4 caracteres)','novo-cliente-usuario','')),
       (campo('Senha demonstrativa (mín. 4 caracteres)','novo-cliente-senha','','password')),
       (campo('Telefone fictício (opcional)','novo-cliente-telefone','','tel', false))]);
}
function telaCadastroBarbeiro() {
  const escolhido=(location.hash.split('/')[1]||'profissional').toLowerCase();
  app.innerHTML=htmlTela("pagina-cadastro-barbeiro", [(abasAcesso('barbeiro')), (campo('Nome do responsável',
      'dono-nome','')), (campo('Usuário (mín. 4 caracteres)','dono-usuario','')), (campo('Senha demonstrativa (mín. 4 caracteres)',
      'dono-senha','','password')), (campo('Nome da barbearia','dono-barbearia','')), (PLANOS.map(p=>'<option value="'+p.id+'" '+(p.id===escolhido?'selected':'')+'>'+p.nome+' — '+dinheiro(p.preco)+'/mês</option>').join(''))]);
}
function telaContaCliente() {
  if (!clienteLogado()) { location.hash='#login-cliente';return; }
  const usuario=dadosCliente();
  const seus=agendamentos.filter(a=>a.clienteUsuario===clienteLogado());
  app.innerHTML=htmlTela("pagina-minha-conta", [(seguro(usuario?.nome||'cliente')), (cardsAgendamentos(seus))]);
}
function telaPlanos() {
  app.innerHTML=htmlTela("pagina-planos", [(PLANOS.map((p,i)=>
      htmlTela("componente-card-plano", [((i===1?'featured':'')), ((i===1?'✦ MAIS POPULAR':'BARBERSYNC')),
           (p.nome), (p.descricao), (dinheiro(p.preco)), (p.recursos.map(t=>'<li>'+seguro(t)+'</li>').join('')),
           ((i===1?'btn-primary':'btn-dark')), (p.id)])).join(''))]);
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
function campo(rotulo, id, valor, tipo, obrigatorio = true) {
  return htmlTela("componente-campo-formulario", [
    seguro(id), seguro(rotulo), seguro(id), seguro(id),
    seguro(tipo || 'text'), seguro(valor || ''),
    obrigatorio ? 'required' : ''
  ]);
}
function botao(texto,classe) {
  return '<button class="btn '+(classe||'btn-primary')+'" type="submit">'+texto+'</button>';
}

// 3. Página inicial: busca, filtros e vitrine de barbearias.
// Cria a página HTML da vitrine. A busca/ordenacão atualiza os cards.
function telaInicio() {
  document.documentElement.style.setProperty('--accent','#d8aa56');
  app.innerHTML =
    htmlTela("pagina-inicio-vitrine", [(seguro(filtro.busca)), ([...new Set(barbearias.map(b=>b.bairro))].sort().map(b=>'<option '+(filtro.bairro===b?'selected':'')+'>'+seguro(b)+'</option>').join('')),
         (['Todos','Corte','Barba','Produtos'].map(t=>'<button class="pill '+(filtro.tipo===t?'active':'')+'" data-tipo="'+t+'">'+t+'</button>').join(''))]);
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
    htmlTela("componente-card-vitrine", [(seguro(b.id)), (seguro(b.nome)), (seguro(b.fotos[0])),
         (seguro(b.bairro)), (seguro(b.nome)), (estrelas(b)), (seguro(b.descricao)), (dinheiro(menorPreco(b)))])).join('') : '<div class="empty">Nenhuma barbearia encontrada. Tente outro filtro.</div>';
}

// 4. Perfil individual, horários, serviços, produtos e avaliações.
// Monta capa, galeria, fotos da equipe, produtos e o formulário de reserva.
function telaBarbearia(id) {
  const b=loja(id);
  if (!b) { location.hash='#inicio'; return; }
  document.documentElement.style.setProperty('--accent',/^#[0-9a-f]{6}$/i.test(b.cor)?b.cor:'#d8aa56');
  app.innerHTML=
    htmlTela("pagina-perfil-barbearia", [(seguro(b.capa||b.fotos[0])), (seguro(b.nome)),
         (seguro(b.bairro.toUpperCase())), (seguro(b.nome)), (seguro(b.bairro)), (estrelas(b)),
         ((podeEditar(b)?'<p style="margin:18px 0 0"><button class="btn btn-primary btn-sm" data-editar-loja="'+seguro(b.id)+'">✎ Editar minha barbearia</button></p>':'')),
         (b.fotos.map((foto,i)=>'<img src="'+seguro(foto)+'" alt="Foto '+(i+1)+' da barbearia" loading="lazy">').join('')),
         (seguro(b.descricao)), (seguro(b.bairro)), (seguro(b.horario)), (b.servicos.map(s=>htmlTela("componente-linha-servico",
         [(seguro(s.nome)), (seguro(s.duracao)), (dinheiro(s.preco))])).join('')), (b.profissionais.map(p=>
        htmlTela("componente-card-profissional", [(((b.fotosProfissionais||{})[p]?'<img src="'+seguro(b.fotosProfissionais[p])+'" alt="Foto de '+seguro(p)+'">':'<div class="pro-avatar">'+seguro(p.slice(0,
            1).toUpperCase())+'</div>')), (seguro(p))])).join('')), (estrelas(b)), ([...b.avaliacoes].reverse().map(a=>htmlTela("componente-avaliacao-barbearia",
             [(seguro(a.nome)), (('★'.repeat(Number(a.estrelas)))), (seguro(a.texto))])).join('')),
             (seguro(b.id)), ((b.produtos.length ? '<section class="panel"><span class="eyebrow">PRODUTOS DISPONÍVEIS</span><h3>Leve seu estilo para casa</h3><div class="product-grid">'+
        b.produtos.map(p=>htmlTela("componente-produto-barbearia", [((p.imagem?'<img src="'+seguro(p.imagem)+'" alt="Foto de '+seguro(p.nome)+'">':'<span aria-label="Sem foto cadastrada">'+seguro(p.emoji||'🧴')+'</span>')),
             (seguro(p.nome)), (dinheiro(p.preco)), (seguro(b.id)), (seguro(p.id))])).join('')+
      '</div></section>' : '')), (b.servicos.map((s,i)=>'<option value="'+i+'">'+seguro(s.nome)+' — '+dinheiro(s.preco)+'</option>').join('')),
           (b.profissionais.map(p=>'<option>'+seguro(p)+'</option>').join('')), (hoje()), (proximaDataDisponivel(b.id,
          b.profissionais[0])), (seguro(nomeCliente())), (seguro(telefoneCliente()))]);
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
  const abas=[['visao','▦ Visão geral'],['agenda','▤ Agenda'],['faturamento','▥ Faturamento'],
      ['avaliacoes','☆ Avaliações'],['pedidos','▣ Pedidos'],['aparencia','◐ Informações e cores'],
      ['fotos','▧ Fotos e equipe'],['catalogo','◈ Produtos']];
  app.innerHTML=
    htmlTela("pagina-painel-barbeiro", [(seguro((PLANOS.find(p=>p.id===b.plano)||PLANOS[1]).nome)),
         (abas.map(a=>'<button class="side-btn '+(abaPainel===a[0]?'active':'')+'" data-aba="'+a[0]+'">'+a[1]+'</button>').join('')),
         (seguro(b.nome)), (disponiveis.map(x=>'<option value="'+seguro(x.id)+'" '+(x.id===b.id?'selected':'')+'>'+seguro(x.nome)+'</option>').join('')),
         (conteudoPainel(b,agenda,vendas,financeiro))]);
}
function tabelaAgenda(agenda) {
  if (!agenda.length) return htmlTela("componente-agenda-vazia", []);
  return htmlTela("componente-tabela-agenda", [([...agenda].sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora)).map(a=>
      htmlTela("componente-linha-agendamento", [(seguro(a.cliente)), ((a.exemplo?'<span class="tag">EXEMPLO</span>':'')),
           (seguro(a.telefone)), (seguro(a.servico)), (seguro(a.profissional)), (dataBR(a.data)),
           (seguro(a.hora)), (seguro(a.status)), ((a.status==='Confirmado'?'<button class="btn btn-primary btn-sm" data-concluir="'+seguro(a.id)+'">Concluir</button>':'—'))])).join(''))]);
}
function conteudoPainel(b,agenda,vendas,financeiro) {
  if (abaPainel==='visao') return     htmlTela("painel-visao-geral", [(agenda.filter(a=>a.status==='Confirmado').length),
       (dinheiro(financeiro.servicos)), (dinheiro(financeiro.produtos)), (dinheiro(financeiro.total)),
       (tabelaAgenda(agenda.filter(a=>a.status==='Confirmado' && a.data>=hoje()))), (tabelaFaturamento(financeiro.profissionais)),
       (painelAvaliacoes(b)), (seguro(b.id))]);
  if (abaPainel==='agenda') return     htmlTela("painel-agenda", [(tabelaAgenda(agenda))]);
  if (abaPainel==='faturamento') return     htmlTela("painel-faturamento", [(dinheiro(financeiro.servicos)),
       (dinheiro(financeiro.produtos)), (dinheiro(financeiro.total)), (tabelaFaturamento(financeiro.profissionais))]);
  if (abaPainel==='avaliacoes') return htmlTela("painel-avaliacoes", [(painelAvaliacoes(b)),
       (seguro(b.nome)), ([...b.avaliacoes].reverse().map(a=>htmlTela("componente-comentario-painel",
       [(seguro(a.nome)), (('★'.repeat(Number(a.estrelas)))), (seguro(a.texto))])).join(''))]);
  if (abaPainel==='pedidos') return htmlTela("painel-pedidos", [((vendas.length ? '<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead><tbody>'+
     [...vendas].reverse().map(p=>htmlTela("componente-linha-pedido", [(seguro(p.cliente)),
          (seguro(p.produto)), (dinheiro(p.preco)), (seguro(p.status||'Aguardando retirada')), ((p.status==='Entregue'?'—':'<button class="btn btn-primary btn-sm" data-entregar="'+seguro(p.id)+'">Entregue</button>'))])).join('')+
     '</tbody></table></div>' : '<p class="muted">Nenhum pedido por enquanto.</p>'))]);
  if (abaPainel==='aparencia') return htmlTela("painel-informacoes", [(campo('Nome da barbearia',
      'editar-nome',b.nome)), (seguro(b.bairro)), (seguro(b.cor)), (seguro(b.descricao)), (seguro(b.horario)),
       (seguro(b.profissionais.join(', '))), (seguro(b.cor)), (seguro(b.nome)), (botao('Salvar alterações'))]);
  if (abaPainel==='fotos') return     htmlTela("painel-fotos-equipe", [(seguro(b.capa||b.fotos[0])),
       (b.fotos.map((foto,i)=>htmlTela("componente-foto-galeria", [(seguro(foto)), ((i+1)), (i),
       ((b.fotos.length===1?'disabled':''))])).join('')), (b.profissionais.map(p=>htmlTela("componente-foto-profissional",
       [(((b.fotosProfissionais||{})[p]?'<img src="'+seguro(b.fotosProfissionais[p])+'" alt="Foto de '+seguro(p)+'">':'<div class="pro-avatar">'+seguro(p.slice(0,
      1).toUpperCase())+'</div>')), (seguro(p)), (seguro(p)), (((b.fotosProfissionais||{})[p]?'<button class="btn btn-outline btn-sm" data-remover-foto-prof="'+seguro(p)+'">Remover foto</button>':''))])).join(''))]);
  if (abaPainel==='catalogo') return htmlTela("painel-catalogo", [(botao('+ Adicionar produto')), ((b.produtos.length?b.produtos.map(p=>
        htmlTela("componente-item-produto-painel", [((p.imagem?'<img class="product-photo-small" src="'+seguro(p.imagem)+'" alt="Foto de '+seguro(p.nome)+'">':'<div class="product-thumb product-photo-small">'+seguro(p.emoji||'🧴')+'</div>')),
             (seguro(p.nome)), (dinheiro(p.preco)), (seguro(p.id)), (seguro(p.id))])).join(''):'<p class="muted">Nenhum produto cadastrado.</p>'))]);
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
    htmlTela("componente-card-agendamento", [(seguro(a.status)), (seguro((loja(a.idLoja)||{}).nome||'Barbearia')),
         (seguro(a.servico)), (seguro(a.profissional)), (dataBR(a.data)), (seguro(a.hora)), (dinheiro(a.preco)),
         ((a.status==='Confirmado'?'<button class="btn btn-outline btn-sm" data-cancelar="'+a.id+'">Cancelar agendamento</button>':'<span class="muted small">'+(a.status==='Concluído'?'Atendimento realizado':'Cancelado')+'</span>'))])).join('');
}
function telaMeusAgendamentos() {
  document.documentElement.style.setProperty('--accent','#d8aa56');
  const logado=!!clienteLogado();
  const seus=agendamentos.filter(a=>logado?a.clienteUsuario===clienteLogado():!a.clienteUsuario&&!a.exemplo);
  app.innerHTML=htmlTela("pagina-meus-agendamentos", [((logado?'Mostrando reservas vinculadas à sua conta de demonstração.':'Você está como visitante. <a href="#login-cliente">Entre como cliente</a> para vincular novos agendamentos à sua conta.')),
       (cardsAgendamentos(seus))]);
}
function modalAvaliacao(id) {
  abrirModal(htmlTela("modal-avaliacao", [(cabecalhoModal('Avaliar barbearia')), (seguro(id)), (campo('Seu nome','avaliador','')), (botao('Publicar avaliação'))]));
}
function modalCompra(idLoja,idProduto) {
  const b=loja(idLoja);
  const p=b && b.produtos.find(x=>x.id===idProduto);
  if (!p) return;
  abrirModal(htmlTela("modal-compra", [(cabecalhoModal('Finalizar pedido')), (seguro(p.nome)),
       (dinheiro(p.preco)), (seguro(idLoja)), (seguro(idProduto)), (campo('Seu nome','comprador',
      '')), (campo('Telefone','tel-comprador','','tel')), (dinheiro(p.preco)), (botao('Confirmar pedido de demonstração'))]));
}
function modalCadastro() {
  abrirModal(htmlTela("modal-cadastro-barbearia", [(cabecalhoModal('Cadastrar nova barbearia')),
       (campo('Nome da barbearia','cad-nome','')), (botao('Criar barbearia'))]));
}
// Reduz as fotos no próprio navegador (sem upload, servidor ou API).

// ======================= NAVEGAÇÃO E INTERAÇÕES =======================
