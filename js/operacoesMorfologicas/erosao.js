document.addEventListener("DOMContentLoaded", function () {
  const botaoErosao = document.getElementById("erosao");

  botaoErosao.addEventListener("click", function () {
    const dadosImagem = obterImagem("input-imagem-1");

    if (!dadosImagem) {
      alert("Por favor, carregue uma imagem primeiro.");
      return;
    }

    console.log("Iniciando operação de erosão morfológica");
    const dadosProcessados = processarErosao(dadosImagem);
    exibirImagemNoCanvas(dadosProcessados, "canvas-output");
    console.log("Operação de erosão concluída e exibida no canvas");
  });

  // Elemento estruturante padrão 3x3 (cruz)
  function obterElementoEstruturante() {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  }

  // Função principal de erosão
  function processarErosao(dadosImagem) {
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

    // Aplicar erosão conforme algoritmo do slide 58:
    // "Se nenhum valor dos pixels da imagem sob os valores não nulos do elemento estruturante for 0, ponha 1 no resultado"
    for (let y = centro; y < altura - centro; y++) {
      for (let x = centro; x < largura - centro; x++) {
        let todosNaoZero = true;

        // Verificar todos os pontos do elemento estruturante
        for (let ey = 0; ey < tamanho; ey++) {
          for (let ex = 0; ex < tamanho; ex++) {
            if (elementoEstruturante[ey][ex] === 1) {
              const py = y - centro + ey;
              const px = x - centro + ex;
              const indice = (py * largura + px) * 4;

              // Converter para escala de cinza para verificação
              const cinza =
                (dados[indice] + dados[indice + 1] + dados[indice + 2]) / 3;

              if (cinza === 0) {
                todosNaoZero = false;
                break;
              }
            }
          }
          if (!todosNaoZero) break;
        }

        // Se todos os pontos sob o elemento estruturante são não-zero, definir como branco
        if (todosNaoZero) {
          const indiceResultado = (y * largura + x) * 4;
          dadosResultado[indiceResultado] = 255; // R
          dadosResultado[indiceResultado + 1] = 255; // G
          dadosResultado[indiceResultado + 2] = 255; // B
        }
      }
    }

    return dadosProcessados;
  }

  // Expose the erosion function globally for reuse in other morphological operations
  window.processarErosaoMorfologica = processarErosao;
});
