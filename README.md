# Cruza.exe — Cruzadinha de Arquitetura Computacional

Jogo de cruzadinha com visual cyberpunk, feito em HTML, CSS e JavaScript puros para treinar os termos da disciplina de Arquitetura Computacional (Sprint 3).

**Site publicado:** https://SEU-USUARIO.github.io/arqcomp-cruzadinha/

## Como jogar

1. Clique numa casa do tabuleiro: a pista da palavra aparece na barra amarela e na lista ao lado.
2. Digite as letras direto nas casas (maiúsculas, sem acento e sem espaço). O cursor avança sozinho.
3. Clique de novo na mesma casa (ou aperte Espaço) para alternar entre horizontal e vertical.
4. Use as setas para mover o cursor e Tab para ir à próxima palavra.
5. **Conferir** marca em verde as palavras certas, em vermelho as erradas ou incompletas, e atualiza o contador ("X de 16 palavras").
6. **Revelar letra** preenche uma casa da palavra selecionada (o jogo conta as dicas usadas).
7. **Reiniciar** limpa o tabuleiro.

## Modo 2: Montar a CPU

Na aba **Montar a CPU**, cada espaço do diagrama mostra a função de um componente. Escolha um componente da bandeja (arraste, ou clique nele e depois no espaço) e encaixe no lugar certo. Acertos ficam verdes, erros balançam em vermelho e o jogo conta as tentativas erradas. São 10 componentes: UC, ULA, registradores, cache, address bus, data bus, RAM, ROM, memória de massa e DMA. **Reiniciar** embaralha a bandeja de novo.

## Palavras e pistas

O tabuleiro usa as 16 palavras da lista.

### Horizontais

| Nº | Palavra | Pista |
|---|---|---|
| 7 | QUADCORE | Chip com quatro processadores independentes trabalhando em paralelo. |
| 8 | DATABUS | Via bidirecional por onde trafega o conteúdo lido ou escrito entre CPU e memória. |
| 9 | ADDRESSBUS | Via de sentido único pela qual a CPU indica a posição de memória a acessar. |
| 10 | ROM | Memória não volátil gravada na fábrica, guarda o código básico de inicialização. |
| 12 | MEMORIADEMASSA | Guarda arquivos e programas de forma permanente; exemplos: HD e SSD. |
| 13 | MICROCONTROLADOR | Chip que reúne processador, memória e portas de entrada e saída; comum no Arduino. |
| 15 | DMA | Recurso que deixa periféricos acessarem a memória sem ocupar a CPU. |
| 16 | FLASH | Memória não volátil regravável em blocos, usada em pen drives e SSDs. |

### Verticais

| Nº | Palavra | Pista |
|---|---|---|
| 1 | ULA | Parte da CPU que faz as contas e as operações lógicas. |
| 2 | DUALCORE | Chip com dois processadores independentes trabalhando em paralelo. |
| 3 | CPU | Cérebro do computador: busca, decodifica e executa as instruções dos programas. |
| 4 | CACHE | Memória pequena e muito rápida que guarda o que a CPU usa com frequência. |
| 5 | UC | Parte da CPU que comanda e coordena os demais componentes durante a execução. |
| 6 | REGISTRADORES | Pequenas áreas ultrarrápidas dentro da CPU que guardam operandos e resultados. |
| 11 | EEPROM | Memória não volátil que se reescreve por sinal de tensão, sem retirar o chip. |
| 14 | RAM | Memória volátil e veloz onde ficam os softwares em uso; perde tudo sem energia. |

## Tecnologias

HTML, CSS e JavaScript, sem bibliotecas. Fontes Chakra Petch e Share Tech Mono (Google Fonts).

## Estrutura

- `index.html`: estrutura da página
- `style.css`: visual cyberpunk
- `script.js`: tabuleiro, pistas, Conferir, contador e Reiniciar
- `cpu.js`: abas e o modo Montar a CPU
