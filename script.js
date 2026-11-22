/* Cruza.exe — Cruzadinha de Arquitetura Computacional
   HTML, CSS e JavaScript puros. */

const DADOS = {"rows": 13, "cols": 17, "items": [{"a": "MICROCONTROLADOR", "r": 9, "c": 1, "d": "H", "n": 13, "clue": "Chip que reúne processador, memória e portas de entrada e saída; comum no Arduino."}, {"a": "REGISTRADORES", "r": 0, "c": 15, "d": "V", "n": 6, "clue": "Pequenas áreas ultrarrápidas dentro da CPU que guardam operandos e resultados."}, {"a": "MEMORIADEMASSA", "r": 7, "c": 2, "d": "H", "n": 12, "clue": "Guarda arquivos e programas de forma permanente; exemplos: HD e SSD."}, {"a": "QUADCORE", "r": 1, "c": 8, "d": "H", "n": 7, "clue": "Chip com quatro processadores independentes trabalhando em paralelo."}, {"a": "DUALCORE", "r": 0, "c": 3, "d": "V", "n": 2, "clue": "Chip com dois processadores independentes trabalhando em paralelo."}, {"a": "ADDRESSBUS", "r": 4, "c": 6, "d": "H", "n": 9, "clue": "Via de sentido único pela qual a CPU indica a posição de memória a acessar."}, {"a": "EEPROM", "r": 6, "c": 10, "d": "V", "n": 11, "clue": "Memória não volátil que se reescreve por sinal de tensão, sem retirar o chip."}, {"a": "UC", "r": 0, "c": 12, "d": "V", "n": 5, "clue": "Parte da CPU que comanda e coordena os demais componentes durante a execução."}, {"a": "CACHE", "r": 0, "c": 10, "d": "V", "n": 4, "clue": "Memória pequena e muito rápida que guarda o que a CPU usa com frequência."}, {"a": "DATABUS", "r": 2, "c": 0, "d": "H", "n": 8, "clue": "Via bidirecional por onde trafega o conteúdo lido ou escrito entre CPU e memória."}, {"a": "RAM", "r": 9, "c": 4, "d": "V", "n": 14, "clue": "Memória volátil e veloz onde ficam os softwares em uso; perde tudo sem energia."}, {"a": "FLASH", "r": 12, "c": 12, "d": "H", "n": 16, "clue": "Memória não volátil regravável em blocos, usada em pen drives e SSDs."}, {"a": "ULA", "r": 0, "c": 1, "d": "V", "n": 1, "clue": "Parte da CPU que faz as contas e as operações lógicas."}, {"a": "CPU", "r": 0, "c": 5, "d": "V", "n": 3, "clue": "Cérebro do computador: busca, decodifica e executa as instruções dos programas."}, {"a": "DMA", "r": 11, "c": 3, "d": "H", "n": 15, "clue": "Recurso que deixa periféricos acessarem a memória sem ocupar a CPU."}, {"a": "ROM", "r": 5, "c": 2, "d": "H", "n": 10, "clue": "Memória não volátil gravada na fábrica, guarda o código básico de inicialização."}]};

const tabuleiro = document.getElementById("tabuleiro");
const barraPista = document.getElementById("barraPista");
const listaH = document.getElementById("listaH");
const listaV = document.getElementById("listaV");
const contador = document.getElementById("contador");
const dicasUsadasEl = document.getElementById("dicasUsadas");
const mensagem = document.getElementById("mensagem");

const palavras = DADOS.items.map((p) => ({ ...p, celulas: [], li: null }));
const celulas = new Map(); // "r,c" -> { r, c, letra, el, input, palavras: [] }

let palavraAtiva = null;
let direcaoPreferida = "H";
let dicasUsadas = 0;

/* ---------- Montagem ---------- */
function montarTabuleiro() {
  tabuleiro.style.gridTemplateColumns = `repeat(${DADOS.cols}, var(--cell))`;

  // cria as casas que pertencem a alguma palavra
  palavras.forEach((p, idx) => {
    for (let i = 0; i < p.a.length; i++) {
      const r = p.r + (p.d === "V" ? i : 0);
      const c = p.c + (p.d === "H" ? i : 0);
      const chave = `${r},${c}`;
      if (!celulas.has(chave)) celulas.set(chave, { r, c, letra: p.a[i], palavras: [] });
      const cel = celulas.get(chave);
      cel.palavras.push(idx);
      p.celulas.push(cel);
    }
  });

  for (let r = 0; r < DADOS.rows; r++) {
    for (let c = 0; c < DADOS.cols; c++) {
      const cel = celulas.get(`${r},${c}`);
      if (!cel) {
        const vazio = document.createElement("div");
        vazio.className = "vazio";
        tabuleiro.appendChild(vazio);
        continue;
      }
      const el = document.createElement("div");
      el.className = "cell";
      el.setAttribute("role", "gridcell");

      const numero = palavras.find((p) => p.r === r && p.c === c);
      if (numero) {
        const n = document.createElement("span");
        n.className = "num";
        n.textContent = numero.n;
        el.appendChild(n);
      }

      const input = document.createElement("input");
      input.type = "text";
      input.autocomplete = "off";
      input.autocapitalize = "characters";
      input.spellcheck = false;
      input.setAttribute("aria-label", `Linha ${r + 1}, coluna ${c + 1}`);
      el.appendChild(input);

      cel.el = el;
      cel.input = input;
      ligarEventos(cel);
      tabuleiro.appendChild(el);
    }
  }
}

function montarPistas() {
  const ordenadas = [...palavras].sort((a, b) => a.n - b.n);
  ordenadas.forEach((p) => {
    const li = document.createElement("li");
    li.tabIndex = 0;
    li.innerHTML = `<span class="n">${p.n}</span><span>${p.clue}</span><span class="qtd">${p.a.length} letras</span>`;
    li.addEventListener("click", () => selecionarPalavra(p, primeiraVazia(p)));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selecionarPalavra(p, primeiraVazia(p));
      }
    });
    p.li = li;
    (p.d === "H" ? listaH : listaV).appendChild(li);
  });
}

/* ---------- Seleção ---------- */
function primeiraVazia(p) {
  return p.celulas.find((c) => !c.input.value) || p.celulas[0];
}

function palavraNaDirecao(cel, dir) {
  const idx = cel.palavras.find((i) => palavras[i].d === dir);
  return idx === undefined ? null : palavras[idx];
}

function selecionarPalavra(p, cel) {
  palavraAtiva = p;
  direcaoPreferida = p.d;
  atualizarDestaques(cel);
  cel.input.focus();
}

function atualizarDestaques(celFoco) {
  celulas.forEach((c) => c.el.classList.remove("na-palavra", "foco"));
  palavras.forEach((p) => p.li.classList.remove("ativa"));
  if (!palavraAtiva) return;

  palavraAtiva.celulas.forEach((c) => c.el.classList.add("na-palavra"));
  palavraAtiva.li.classList.add("ativa");
  if (celFoco) celFoco.el.classList.add("foco");

  const sentido = palavraAtiva.d === "H" ? "Horizontal" : "Vertical";
  barraPista.innerHTML =
    `<span class="tag">${palavraAtiva.n} ${sentido}</span>${palavraAtiva.clue} ` +
    `<span class="tamanho">(${palavraAtiva.a.length} letras)</span>`;
}

/* ---------- Entrada do jogador ---------- */
function limparStatus() {
  celulas.forEach((c) => c.el.classList.remove("certa", "errada"));
  palavras.forEach((p) => p.li.classList.remove("certa", "errada"));
  mensagem.textContent = "";
  mensagem.classList.remove("vitoria");
}

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
}

function mover(cel, dr, dc) {
  let r = cel.r + dr;
  let c = cel.c + dc;
  while (r >= 0 && c >= 0 && r < DADOS.rows && c < DADOS.cols) {
    const alvo = celulas.get(`${r},${c}`);
    if (alvo) return alvo;
    r += dr;
    c += dc;
  }
  return null;
}

function irPara(cel) {
  if (!cel) return;
  cel.input.focus();
}

function proximaNaPalavra(cel, passo) {
  if (!palavraAtiva) return null;
  const i = palavraAtiva.celulas.indexOf(cel);
  return palavraAtiva.celulas[i + passo] || null;
}

function ligarEventos(cel) {
  const { input } = cel;

  input.addEventListener("focus", () => {
    const naAtiva = palavraAtiva && cel.palavras.includes(palavras.indexOf(palavraAtiva));
    if (!naAtiva) {
      palavraAtiva =
        palavraNaDirecao(cel, direcaoPreferida) || palavras[cel.palavras[0]];
    }
    direcaoPreferida = palavraAtiva.d;
    atualizarDestaques(cel);
    input.select();
  });

  // clicar numa casa que já está em foco alterna H/V quando há cruzamento
  input.addEventListener("mousedown", () => {
    if (document.activeElement === input && cel.palavras.length > 1) {
      const outra = palavraAtiva.d === "H" ? "V" : "H";
      palavraAtiva = palavraNaDirecao(cel, outra) || palavraAtiva;
      direcaoPreferida = palavraAtiva.d;
      atualizarDestaques(cel);
    }
  });

  input.addEventListener("input", () => {
    const letra = normalizar(input.value).slice(-1);
    input.value = letra;
    cel.el.classList.remove("revelada");
    limparStatus();
    if (letra) irPara(proximaNaPalavra(cel, 1));
  });

  input.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); irPara(mover(cel, 0, 1)); break;
      case "ArrowLeft":  e.preventDefault(); irPara(mover(cel, 0, -1)); break;
      case "ArrowDown":  e.preventDefault(); irPara(mover(cel, 1, 0)); break;
      case "ArrowUp":    e.preventDefault(); irPara(mover(cel, -1, 0)); break;
      case "Backspace":
        if (!input.value) {
          e.preventDefault();
          const anterior = proximaNaPalavra(cel, -1);
          if (anterior) {
            anterior.input.value = "";
            anterior.el.classList.remove("revelada");
            limparStatus();
            irPara(anterior);
          }
        }
        break;
      case " ":
        e.preventDefault();
        if (cel.palavras.length > 1) {
          const outra = palavraAtiva.d === "H" ? "V" : "H";
          palavraAtiva = palavraNaDirecao(cel, outra) || palavraAtiva;
          direcaoPreferida = palavraAtiva.d;
          atualizarDestaques(cel);
        }
        break;
      case "Tab": {
        e.preventDefault();
        const ordem = [...palavras].sort((a, b) => a.n - b.n || (a.d === "H" ? -1 : 1));
        const i = ordem.indexOf(palavraAtiva);
        const prox = ordem[(i + (e.shiftKey ? -1 : 1) + ordem.length) % ordem.length];
        selecionarPalavra(prox, primeiraVazia(prox));
        break;
      }
    }
  });
}

/* ---------- Botões ---------- */
function estadoDaPalavra(p) {
  const digitado = p.celulas.map((c) => c.input.value).join("");
  if (digitado.length === 0) return "vazia";
  return digitado === p.a ? "certa" : "errada";
}

function conferir() {
  limparStatus();
  let acertos = 0;

  palavras.forEach((p) => {
    const estado = estadoDaPalavra(p);
    if (estado === "certa") {
      acertos++;
      p.li.classList.add("certa");
      p.celulas.forEach((c) => c.el.classList.add("certa"));
    } else if (estado === "errada") {
      p.li.classList.add("errada");
    }
  });

  // pinta de vermelho só as casas preenchidas que não pertencem a nenhuma palavra certa
  palavras.forEach((p) => {
    if (p.li.classList.contains("errada")) {
      p.celulas.forEach((c) => {
        if (c.input.value && !c.el.classList.contains("certa")) c.el.classList.add("errada");
      });
    }
  });

  contador.textContent = `${acertos} de ${palavras.length} palavras`;

  if (acertos === palavras.length) {
    mensagem.textContent = "SISTEMA INVADIDO — você acertou todas as palavras!";
    mensagem.classList.add("vitoria");
  } else {
    mensagem.textContent = "Verde: certa. Vermelho: errada ou incompleta. Sem cor: ainda vazia.";
  }
}

function revelarLetra() {
  if (!palavraAtiva) {
    mensagem.textContent = "Selecione uma palavra antes de pedir uma dica.";
    return;
  }
  const alvo = palavraAtiva.celulas.find((c, i) => c.input.value !== palavraAtiva.a[i]);
  if (!alvo) {
    mensagem.textContent = "Essa palavra já está completa e correta.";
    return;
  }
  alvo.input.value = alvo.letra;
  alvo.el.classList.add("revelada");
  dicasUsadas++;
  dicasUsadasEl.textContent = `Dicas usadas: ${dicasUsadas}`;
  limparStatus();
  alvo.input.focus();
}

function reiniciar() {
  celulas.forEach((c) => {
    c.input.value = "";
    c.el.classList.remove("revelada");
  });
  limparStatus();
  dicasUsadas = 0;
  dicasUsadasEl.textContent = "Dicas usadas: 0";
  contador.textContent = `0 de ${palavras.length} palavras`;
  palavraAtiva = null;
  atualizarDestaques(null);
  barraPista.textContent = "Selecione uma casa para ver a pista.";
}

document.getElementById("btnConferir").addEventListener("click", conferir);
document.getElementById("btnDica").addEventListener("click", revelarLetra);
document.getElementById("btnReiniciar").addEventListener("click", reiniciar);

montarTabuleiro();
montarPistas();
contador.textContent = `0 de ${palavras.length} palavras`;
