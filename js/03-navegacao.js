// Navegação entre telas e recebimento de fotos.

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

// Os cliques ficam no arquivo 04-interacoes.js.
