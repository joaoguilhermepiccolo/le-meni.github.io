document.addEventListener("DOMContentLoaded", function () {
  const botaoDilatacao = document.getElementById("dilatacao");

  botaoDilatacao.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (!dadosImagem) {
      alert("Por favor, carregue uma imagem primeiro.");
      return;
    }

    console.log("Iniciando operação de dilatação morfológica");
    const dadosProcessados = processarDilatacao(dadosImagem);
    exibirImagemNoCanvas(dadosProcessados, "canvas-output");
    console.log("Operação de dilatação concluída e exibida no canvas");
  });

  // Elemento estruturante padrão 3x3 (cruz)
  function obterElementoEstruturante() {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  }

  // Função principal de dilatação
  function processarDilatacao(dadosImagem) {
    const canvas = document.createElement("canvas");
    canvas.width = dadosImagem.width;
    canvas.height = dadosImagem.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(dadosImagem, 0, 0);

    const dadosProcessados = ctx.getImageData(
      0,
      0,
      dadosImagem.width,
      dadosImagem.height,
    );

    const dados = dadosImagem.data;
    const dadosResultado = dadosProcessados.data;
    const largura = dadosImagem.width;
    const altura = dadosImagem.height;
    const elementoEstruturante = obterElementoEstruturante();
    const tamanho = elementoEstruturante.length;
    const centro = Math.floor(tamanho / 2);

    // Inicializar resultado como preto
    for (let i = 0; i < dadosResultado.length; i += 4) {
      dadosResultado[i] = 0; // R
      dadosResultado[i + 1] = 0; // G
      dadosResultado[i + 2] = 0; // B
      dadosResultado[i + 3] = dados[i + 3]; // A
    }

    // Aplicar dilatação conforme algoritmo do slide 53:
    // "Se o valor do pixel sob o elemento central for diferente de 0, copie todos os valores 1 do elemento estruturante para a imagem resultante"
    for (let y = centro; y < altura - centro; y++) {
      for (let x = centro; x < largura - centro; x++) {
        const indice = (y * largura + x) * 4;

        // Converter para valor binário estrito (0 ou 255) usando threshold
        const cinzaBinario =
          (dados[indice] + dados[indice + 1] + dados[indice + 2]) / 3 > 127
            ? 255
            : 0;

        // Se o pixel central é branco (255), aplicar o elemento estruturante
        if (cinzaBinario === 255) {
          for (let ey = 0; ey < tamanho; ey++) {
            for (let ex = 0; ex < tamanho; ex++) {
              if (elementoEstruturante[ey][ex] === 1) {
                const py = y - centro + ey;
                const px = x - centro + ex;

                // Verificar limites da imagem
                if (py >= 0 && py < altura && px >= 0 && px < largura) {
                  const indiceResultado = (py * largura + px) * 4;
                  dadosResultado[indiceResultado] = 255; // R
                  dadosResultado[indiceResultado + 1] = 255; // G
                  dadosResultado[indiceResultado + 2] = 255; // B
                }
              }
            }
          }
        }
      }
    }

    return dadosProcessados;
  }

  // Exposicao da operacao de dilatacao para uso global
  window.processarDilatacaoMorfologica = processarDilatacao;
});
