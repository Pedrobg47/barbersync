// BarberSync: este é o único JavaScript do projeto.
// Cadastros e reservas são apenas demonstrações salvas neste navegador.

const CHAVE = "barbersync_demo_";
const $ = id => document.getElementById(id);
const ler = nome => JSON.parse(localStorage.getItem(CHAVE + nome) || "[]");
const salvar = (nome, dados) => localStorage.setItem(CHAVE + nome, JSON.stringify(dados));
const sessao = tipo => sessionStorage.getItem(CHAVE + tipo);
const valor = id => $(id).value.trim();

const lojasFixas = [
  {id:"estacao47", nome:"Estação 47 Barber", bairro:"Alphaville", equipe:["Lucas","André","Bruno"]},
  {id:"nobre", nome:"Nobre Barbearia", bairro:"Centro", equipe:["Gustavo","Matheus"]},
  {id:"distrito", nome:"Distrito do Corte", bairro:"Jardim Belval", equipe:["Pedro","Diego"]},
  {id:"vertice", nome:"Vértice Barber", bairro:"Jardim Silveira", equipe:["Caio","Renato"]}
];
const lojas = () => lojasFixas.concat(ler("lojas"));
const clientes = () => [{usuario:"cliente",senha:"demo123",nome:"Cliente TCC",telefone:""}].concat(ler("clientes"));
const donos = () => lojasFixas.map(l => ({usuario:l.id,senha:"demo123",loja:l.id})).concat(ler("donos"));

// 1. Tema: guarda a preferência e funciona em todas as páginas.
function mudarTema() {
  const escuro = document.body.classList.toggle("tema-escuro");
  localStorage.setItem(CHAVE + "tema", escuro ? "escuro" : "claro");
  $("tema").textContent = escuro ? "☀ Modo claro" : "☾ Modo escuro";
}
if (localStorage.getItem(CHAVE + "tema") === "escuro") {
  document.body.classList.add("tema-escuro");
  $("tema").textContent = "☀ Modo claro";
}
$("tema").addEventListener("click", mudarTema);

// 2. Cadastro de clientes e de donos.
const cadastroCliente = $("form-cadastro-cliente");
if (cadastroCliente) cadastroCliente.addEventListener("submit", function (e) {
  e.preventDefault();
  const usuario = valor("usuario").toLowerCase();
  if (clientes().some(c => c.usuario === usuario)) return alert("Usuário já cadastrado.");
  const lista = ler("clientes");
  lista.push({usuario, senha:valor("senha"), nome:valor("nome"), telefone:valor("telefone")});
  salvar("clientes", lista);
  sessionStorage.setItem(CHAVE + "cliente", usuario);
  location.href = "conta.html";
});

const cadastroDono = $("form-cadastro-barbearia");
if (cadastroDono) cadastroDono.addEventListener("submit", function (e) {
  e.preventDefault();
  const usuario = valor("usuario").toLowerCase();
  if (donos().some(d => d.usuario === usuario)) return alert("Usuário já cadastrado.");
  const id = "loja" + Date.now();
  const novaLoja = {id, nome:valor("barbearia"), bairro:valor("bairro"), equipe:["Barbeiro principal"]};
  salvar("lojas", ler("lojas").concat(novaLoja));
  salvar("donos", ler("donos").concat({usuario, senha:valor("senha"), loja:id}));
  sessionStorage.setItem(CHAVE + "dono", usuario);
  location.href = "painel.html";
});

// 3. Logins de demonstração.
const loginCliente = $("form-login-cliente");
if (loginCliente) loginCliente.addEventListener("submit", function (e) {
  e.preventDefault();
  const conta = clientes().find(c =>
    c.usuario === valor("cliente-usuario").toLowerCase() && c.senha === valor("cliente-senha"));
  if (!conta) return alert("Usuário ou senha incorretos.");
  sessionStorage.setItem(CHAVE + "cliente", conta.usuario);
  location.href = "conta.html";
});

const loginDono = $("form-login-dono");
if (loginDono) loginDono.addEventListener("submit", function (e) {
  e.preventDefault();
  const conta = donos().find(d =>
    d.usuario === valor("barbeiro-usuario").toLowerCase() && d.senha === valor("barbeiro-senha"));
  if (!conta) return alert("Usuário ou senha incorretos.");
  sessionStorage.setItem(CHAVE + "dono", conta.usuario);
  location.href = "painel.html";
});

// 4. Novas barbearias aparecem na página inicial.
if ($("modelo-loja")) {
  ler("lojas").forEach(loja => {
    const card = $("modelo-loja").content.firstElementChild.cloneNode(true);
    card.href = "agendar.html?barbearia=" + encodeURIComponent(loja.id);
    card.querySelector(".nome-loja").textContent = loja.nome;
    card.querySelector(".bairro-loja").textContent = loja.bairro;
    card.querySelector(".descricao-loja").textContent = "Barbearia cadastrada nesta demonstração.";
    const bairros = {"Alphaville":"alphaville","Centro":"centro","Jardim Belval":"belval","Jardim Silveira":"silveira"};
    card.classList.add(bairros[loja.bairro] || "alphaville");
    $("cards-lojas").appendChild(card);
  });
  $("total-lojas").textContent = lojas().length + " barbearias";
}

// 5. Escolha do estabelecimento, profissional, data e hora.
if ($("form-agendar")) {
  const barbearia = $("barbearia");
  const profissional = $("profissional");
  const dia = $("data");
  const hora = $("hora");

  ler("lojas").forEach(loja => {
    const option = document.createElement("option");
    option.value = loja.id;
    option.textContent = loja.nome;
    barbearia.appendChild(option);
  });

  function horasDisponiveis() {
    const data = dia.value;
    const domingo = data && new Date(data + "T12:00:00").getDay() === 0;
    const agora = new Date();
    const hoje = agora.getFullYear() + "-" + String(agora.getMonth()+1).padStart(2,"0")
      + "-" + String(agora.getDate()).padStart(2,"0");
    const horasAtuais = agora.toTimeString().slice(0,5);
    Array.from(hora.options).forEach(option => {
      if (!option.value) return;
      const ocupado = ler("reservas").some(r => r.loja === barbearia.value &&
        r.profissional === profissional.value && r.data === data &&
        r.hora === option.value && r.status === "Confirmado");
      option.disabled = ocupado || domingo || data < hoje ||
        (data === hoje && option.value <= horasAtuais);
    });
    if (hora.selectedOptions[0]?.disabled) hora.value = "";
  }

  function profissionaisDaLoja() {
    profissional.innerHTML = '<option value="">Selecione um profissional</option>';
    const loja = lojas().find(l => l.id === barbearia.value);
    if (loja) loja.equipe.forEach(nome => {
      const option = document.createElement("option");
      option.textContent = nome;
      profissional.appendChild(option);
    });
    horasDisponiveis();
  }

  const agora = new Date();
  dia.min = agora.getFullYear() + "-" + String(agora.getMonth()+1).padStart(2,"0")
    + "-" + String(agora.getDate()).padStart(2,"0");
  barbearia.addEventListener("change", profissionaisDaLoja);
  profissional.addEventListener("change", horasDisponiveis);
  dia.addEventListener("change", horasDisponiveis);
  const escolhida = new URLSearchParams(location.search).get("barbearia");
  if (lojas().some(l => l.id === escolhida)) barbearia.value = escolhida;
  profissionaisDaLoja();

  const cliente = clientes().find(c => c.usuario === sessao("cliente"));
  if (cliente) {
    $("nome").value = cliente.nome;
    $("telefone").value = cliente.telefone;
  }

  $("form-agendar").addEventListener("submit", function (e) {
    e.preventDefault();
    // Dentro do perfil, visitantes também podem agendar na demonstração.
    // Na página separada de agendamento, mantemos o login de cliente.
    if (!sessao("cliente") && !$("resultado-agendamento")) {
      alert("Faça login como cliente para agendar.");
      location.href = "cliente.html";
      return;
    }
    horasDisponiveis();
    if (!hora.value || hora.selectedOptions[0].disabled ||
        !profissional.value || !barbearia.value) {
      return alert("Escolha um horário disponível.");
    }
    const reserva = {
      id:Date.now(), loja:barbearia.value, cliente:sessao("cliente"),
      nome:valor("nome"), telefone:valor("telefone"), servico:valor("servico"),
      profissional:profissional.value, data:dia.value, hora:hora.value, status:"Confirmado"
    };
    salvar("reservas", ler("reservas").concat(reserva));
    sessionStorage.setItem(CHAVE + "ultimaReserva", String(reserva.id));
    if ($("resultado-agendamento")) {
      // No perfil da barbearia, mostramos a confirmação na mesma página.
      $("reserva-detalhes").textContent = reserva.servico + " com " +
        reserva.profissional + " em " + reserva.data.split("-").reverse().join("/") +
        " às " + reserva.hora + ".";
      $("form-agendar").hidden = true;
      $("resultado-agendamento").hidden = false;
    } else {
      location.href = "confirmacao.html";
    }
  });
}

// 6. Área do cliente: mostra e permite cancelar os próprios horários.
if ($("lista-cliente")) {
  if (!sessao("cliente")) location.replace("cliente.html");
  else {
    const conta = clientes().find(c => c.usuario === sessao("cliente"));
    $("saudacao").textContent = "Olá, " + (conta?.nome || "cliente") + "!";
    const reservas = ler("reservas").filter(r => r.cliente === sessao("cliente"));
    if (!reservas.length) $("lista-cliente").textContent = "Você ainda não tem agendamentos.";
    reservas.forEach(r => {
      const item = document.createElement("div");
      item.className = "appointment";
      const texto = document.createElement("span");
      const nome = lojas().find(l => l.id === r.loja)?.nome || "Barbearia";
      texto.textContent = nome + " · " + r.servico + " · " + r.profissional +
        " · " + r.data.split("-").reverse().join("/") + " " + r.hora + " · " + r.status;
      item.appendChild(texto);
      if (r.status === "Confirmado") {
        const botao = document.createElement("button");
        botao.className = "btn btn-outline";
        botao.textContent = "Cancelar";
        botao.addEventListener("click", function () {
          if (!confirm("Cancelar agendamento?")) return;
          const lista = ler("reservas");
          const agendamento = lista.find(a => a.id === r.id && a.cliente === sessao("cliente"));
          if (agendamento) agendamento.status = "Cancelado";
          salvar("reservas", lista);
          location.reload();
        });
        item.appendChild(botao);
      }
      $("lista-cliente").appendChild(item);
    });
  }
}

// 7. Painel do proprietário: a agenda mostra apenas sua barbearia.
if ($("linhas-agenda")) {
  const dono = donos().find(d => d.usuario === sessao("dono"));
  if (!dono) location.replace("barbeiro.html");
  else {
    const loja = lojas().find(l => l.id === dono.loja);
    $("nome-painel").textContent = loja.nome;
    $("nome-barbearia-painel").textContent = loja.nome;
    $("bairro-painel").textContent = loja.bairro;
    $("equipe-painel").textContent = loja.equipe.join(", ");
    const reservas = ler("reservas").filter(r => r.loja === loja.id);
    $("total-agenda").textContent = reservas.filter(r => r.status === "Confirmado").length;
    if (!reservas.length) {
      $("linhas-agenda").insertRow().insertCell().textContent = "Nenhum agendamento ainda.";
    }
    reservas.forEach(r => {
      const linha = $("linhas-agenda").insertRow();
      [r.nome, r.servico, r.profissional,
        r.data.split("-").reverse().join("/") + " " + r.hora, r.status
      ].forEach(t => linha.insertCell().textContent = t);
    });
  }
}

// 8. Botões para sair e tela de confirmação.
["cliente","dono"].forEach(tipo => {
  const botao = $("sair-" + tipo);
  if (botao) botao.addEventListener("click", function () {
    sessionStorage.removeItem(CHAVE + tipo);
    location.href = tipo === "cliente" ? "cliente.html" : "barbeiro.html";
  });
});
if ($("mensagem-reserva")) {
  const id = Number(sessionStorage.getItem(CHAVE + "ultimaReserva"));
  const reserva = ler("reservas").find(r => r.id === id && r.cliente === sessao("cliente"));
  if (reserva) {
    const nome = lojas().find(l => l.id === reserva.loja)?.nome || "Barbearia";
    $("mensagem-reserva").textContent = "Reserva salva neste navegador: " + nome +
      " em " + reserva.data.split("-").reverse().join("/") + " às " + reserva.hora + ".";
  } else {
    $("mensagem-reserva").textContent = "Nenhum agendamento recente nesta sessão.";
  }
}
