/* Modo 2 — Montar a CPU
   O jogador coloca cada componente no espaço cuja função combina com ele.
   Funciona com arrastar e soltar (mouse) e com clicar no componente e depois no espaço (celular/teclado). */

const PECAS = [
  { id: "UC", nome: "UC", grupo: "cpu", dica: "Comanda e coordena os demais componentes durante a execução." },
  { id: "ULA", nome: "ULA", grupo: "cpu", dica: "Faz as contas e as operações lógicas." },
  { id: "REGISTRADORES", nome: "Registradores", grupo: "cpu", dica: "Áreas mínimas e ultrarrápidas que guardam operandos e resultados." },
  { id: "CACHE", nome: "Cache", grupo: "cpu", dica: "Memória pequena e rápida que guarda o que é usado com frequência." },
  { id: "ADDRESSBUS", nome: "Address bus", grupo: "bus", dica: "Via de sentido único que indica a posição de memória a acessar." },
  { id: "DATABUS", nome: "Data bus", grupo: "bus", dica: "Via bidirecional por onde trafega o conteúdo lido ou escrito." },
  { id: "RAM", nome: "RAM", grupo: "mem", dica: "Memória volátil e veloz onde ficam os programas em uso." },
  { id: "ROM", nome: "ROM", grupo: "mem", dica: "Memória não volátil de fábrica, com o código básico de inicialização." },
  { id: "MEMORIADEMASSA", nome: "Memória de massa", grupo: "mem", dica: "Armazenamento permanente de arquivos e programas, como HD e SSD." },
  { id: "DMA", nome: "DMA", grupo: "mem", dica: "Deixa periféricos acessarem a memória sem ocupar a CPU." },
];

const cpuEls = {
  bandeja: document.getElementById("bandeja"),
  instrucao: document.getElementById("cpuInstrucao"),
  contador: document.getElementById("cpuContador"),
  tentativas: document.getElementById("cpuTentativas"),
  mensagem: document.getElementById("cpuMensagem"),
  grupos: {
    cpu: document.getElementById("gCpu"),
    bus: document.getElementById("gBarramentos"),
    mem: document.getElementById("gMemorias"),
  },
};

const slots = new Map();   // id -> botão do espaço
const chips = new Map();   // id -> botão do componente
let selecionado = null;
let colocados = 0;
let erros = 0;

function embaralhar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function montarSlots() {
  PECAS.forEach((p) => {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "slot";
    slot.dataset.id = p.id;
    slot.innerHTML = `<span class="slot-nome"></span><span class="slot-dica">${p.dica}</span>`;
    slot.addEventListener("click", () => tentar(selecionado, p.id));
    slot.addEventListener("dragover", (e) => {
      if (!slot.classList.contains("certa")) { e.preventDefault(); slot.classList.add("alvo"); }
    });
    slot.addEventListener("dragleave", () => slot.classList.remove("alvo"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("alvo");
      tentar(e.dataTransfer.getData("text/plain"), p.id);
    });
    slots.set(p.id, slot);
    cpuEls.grupos[p.grupo].appendChild(slot);
  });
}

function montarBandeja() {
  cpuEls.bandeja.innerHTML = "";
  embaralhar(PECAS).forEach((p) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.draggable = true;
    chip.textContent = p.nome;
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => selecionar(p.id));
    chip.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", p.id);
      selecionar(p.id);
    });
    chips.set(p.id, chip);
    cpuEls.bandeja.appendChild(chip);
  });
}

function selecionar(id) {
  selecionado = selecionado === id ? null : id;
  chips.forEach((chip, cid) => {
    const ativo = cid === selecionado;
    chip.classList.toggle("selecionado", ativo);
    chip.setAttribute("aria-pressed", String(ativo));
  });
  const peca = PECAS.find((p) => p.id === selecionado);
  cpuEls.instrucao.textContent = peca
    ? `Selecionado: ${peca.nome}. Agora clique no espaço onde ele deve ficar.`
    : "Escolha um componente (clique ou arraste) e coloque no espaço cuja função combina com ele.";
}

function tentar(idPeca, idSlot) {
  const slot = slots.get(idSlot);
  if (!idPeca || slot.classList.contains("certa")) return;

  if (idPeca === idSlot) {
    const peca = PECAS.find((p) => p.id === idPeca);
    slot.classList.add("certa");
    slot.querySelector(".slot-nome").textContent = peca.nome;
    chips.get(idPeca).remove();
    chips.delete(idPeca);
    selecionado = null;
    colocados++;
    cpuEls.contador.textContent = `${colocados} de ${PECAS.length} componentes`;
    cpuEls.instrucao.textContent = "Encaixou! Escolha o próximo componente.";
    cpuEls.mensagem.textContent = "";
    if (colocados === PECAS.length) {
      cpuEls.instrucao.textContent = "Todos os componentes no lugar.";
      cpuEls.mensagem.textContent = erros === 0
        ? "CPU ONLINE — montagem perfeita, sem nenhum erro!"
        : `CPU ONLINE — montada com ${erros} tentativa(s) errada(s).`;
      cpuEls.mensagem.classList.add("vitoria");
    }
  } else {
    erros++;
    cpuEls.tentativas.textContent = `Tentativas erradas: ${erros}`;
    cpuEls.mensagem.textContent = "Esse componente não combina com a função desse espaço. Leia a descrição e tente outro.";
    slot.classList.add("errada");
    setTimeout(() => slot.classList.remove("errada"), 600);
  }
}

function reiniciarCpu() {
  slots.forEach((slot) => {
    slot.classList.remove("certa", "errada", "alvo");
    slot.querySelector(".slot-nome").textContent = "";
  });
  chips.clear();
  selecionado = null;
  colocados = 0;
  erros = 0;
  cpuEls.contador.textContent = `0 de ${PECAS.length} componentes`;
  cpuEls.tentativas.textContent = "Tentativas erradas: 0";
  cpuEls.mensagem.textContent = "";
  cpuEls.mensagem.classList.remove("vitoria");
  cpuEls.instrucao.textContent = "Escolha um componente (clique ou arraste) e coloque no espaço cuja função combina com ele.";
  montarBandeja();
}

/* ---------- Abas ---------- */
const abas = [
  { botao: document.getElementById("tabCruzadinha"), painel: document.getElementById("abaCruzadinha") },
  { botao: document.getElementById("tabCpu"), painel: document.getElementById("abaCpu") },
];
abas.forEach((aba) => {
  aba.botao.addEventListener("click", () => {
    abas.forEach((o) => {
      const ativa = o === aba;
      o.painel.hidden = !ativa;
      o.botao.classList.toggle("ativa", ativa);
      o.botao.setAttribute("aria-selected", String(ativa));
    });
  });
});

document.getElementById("cpuReiniciar").addEventListener("click", reiniciarCpu);

montarSlots();
montarBandeja();
